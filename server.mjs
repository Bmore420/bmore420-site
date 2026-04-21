import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function loadEnvFile(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, 'utf8');
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const PORT = Number(process.env.PORT || 8787);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'stripe-orders.json');

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(payload));
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';

    request.on('data', (chunk) => {
      raw += chunk;
    });

    request.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON payload.'));
      }
    });

    request.on('error', () => {
      reject(new Error('Request body could not be read.'));
    });
  });
}

function readRawBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    request.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    request.on('error', () => {
      reject(new Error('Request body could not be read.'));
    });
  });
}

function normalizeCart(cart) {
  if (!Array.isArray(cart)) {
    return [];
  }

  return cart
    .filter((item) => item && typeof item.name === 'string')
    .map((item) => ({
      name: item.name,
      size: typeof item.size === 'string' ? item.size : '',
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
    }))
    .filter((item) => item.quantity > 0 && item.price > 0);
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readOrders() {
  ensureDataDir();

  if (!fs.existsSync(ORDERS_FILE)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function upsertOrder(order) {
  const orders = readOrders();
  const index = orders.findIndex((item) => item.sessionId === order.sessionId);

  if (index >= 0) {
    orders[index] = { ...orders[index], ...order };
  } else {
    orders.push(order);
  }

  writeOrders(orders);
}

function getOrderBySessionId(sessionId) {
  return readOrders().find((item) => item.sessionId === sessionId) || null;
}

function parseStripeSignature(header) {
  if (!header) {
    throw new Error('Missing Stripe signature header.');
  }

  const values = Object.fromEntries(
    header
      .split(',')
      .map((entry) => entry.trim().split('='))
      .filter(([key, value]) => key && value),
  );

  if (!values.t || !values.v1) {
    throw new Error('Invalid Stripe signature header.');
  }

  return {
    timestamp: values.t,
    signature: values.v1,
  };
}

function verifyStripeWebhookSignature(rawBody, signatureHeader) {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET.');
  }

  const { timestamp, signature } = parseStripeSignature(signatureHeader);
  const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
  const expected = crypto
    .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new Error('Invalid Stripe webhook signature.');
  }
}

function storeCompletedCheckoutSession(session) {
  upsertOrder({
    sessionId: session.id,
    status: session.payment_status || 'unknown',
    amountTotal: session.amount_total || 0,
    currency: session.currency || 'usd',
    customerEmail: session.customer_details?.email || session.customer_email || '',
    customerName: session.metadata?.customer_name || session.customer_details?.name || '',
    customerPhone: session.metadata?.customer_phone || session.customer_details?.phone || '',
    shippingAddress: session.metadata?.shipping_address || '',
    completedAt: new Date().toISOString(),
  });
}

async function createCheckoutSession(body) {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY.');
  }

  const cart = normalizeCart(body.cart);
  if (cart.length === 0) {
    throw new Error('Cart is empty.');
  }

  const customer = body.customer && typeof body.customer === 'object' ? body.customer : {};
  const lineItems = cart.flatMap((item) =>
    item.size
      ? [
          ['line_items[][price_data][currency]', 'usd'],
          ['line_items[][price_data][product_data][name]', item.name],
          ['line_items[][price_data][product_data][description]', `Size ${item.size}`],
          ['line_items[][price_data][unit_amount]', String(item.price * 100)],
          ['line_items[][quantity]', String(item.quantity)],
        ]
      : [],
  );

  const metadata = [
    ['metadata[customer_name]', typeof customer.name === 'string' ? customer.name : ''],
    ['metadata[customer_phone]', typeof customer.phone === 'string' ? customer.phone : ''],
    ['metadata[shipping_address]', typeof customer.address === 'string' ? customer.address : ''],
  ];

  const formEntries = [
    ['mode', 'payment'],
    ['billing_address_collection', 'required'],
    ['phone_number_collection[enabled]', 'true'],
    ['shipping_address_collection[allowed_countries][]', 'US'],
    ['success_url', `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`],
    ['cancel_url', `${APP_URL}/checkout/cancel`],
    ...lineItems,
    ...metadata,
  ];

  if (typeof customer.email === 'string' && customer.email.trim()) {
    formEntries.push(['customer_email', customer.email.trim()]);
  }

  const form = new URLSearchParams(formEntries);

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });

  const payload = await stripeResponse.json();

  if (!stripeResponse.ok || typeof payload.url !== 'string') {
    const message =
      payload && typeof payload.error?.message === 'string'
        ? payload.error.message
        : 'Stripe checkout session could not be created.';
    throw new Error(message);
  }

  return payload.url;
}

async function handleStripeWebhook(request, response) {
  try {
    const rawBody = await readRawBody(request);
    verifyStripeWebhookSignature(rawBody, request.headers['stripe-signature']);

    const event = JSON.parse(rawBody.toString('utf8'));

    if (event.type === 'checkout.session.completed' && event.data?.object?.id) {
      storeCompletedCheckoutSession(event.data.object);
    }

    sendJson(response, 200, { received: true });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : 'Webhook could not be processed.',
    });
  }
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 404, { error: 'Not found.' });
    return;
  }

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === 'POST' && request.url === '/api/create-checkout-session') {
    try {
      const body = await parseBody(request);
      const url = await createCheckoutSession(body);
      sendJson(response, 200, { url });
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : 'Checkout could not be created.',
      });
    }
    return;
  }

  if (request.method === 'POST' && request.url === '/api/stripe-webhook') {
    await handleStripeWebhook(request, response);
    return;
  }

  if (request.method === 'GET' && request.url.startsWith('/api/checkout-session-status')) {
    const url = new URL(request.url, `http://localhost:${PORT}`);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      sendJson(response, 400, { error: 'Missing session_id.' });
      return;
    }

    const order = getOrderBySessionId(sessionId);
    sendJson(response, 200, {
      found: Boolean(order),
      order,
    });
    return;
  }

  sendJson(response, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Stripe API server listening on http://localhost:${PORT}`);
});
