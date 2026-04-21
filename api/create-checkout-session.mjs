const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.APP_URL;

function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];
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

function getAppUrl() {
  if (!APP_URL) {
    throw new Error('Missing APP_URL.');
  }

  const appUrl = new URL(APP_URL);
  if (!/^https?:$/.test(appUrl.protocol)) {
    throw new Error('APP_URL must use http or https.');
  }

  return appUrl.toString().replace(/\/$/, '');
}

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'POST, OPTIONS');
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!STRIPE_SECRET_KEY) {
    response.status(500).json({ error: 'Missing STRIPE_SECRET_KEY.' });
    return;
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body || {};
    const cart = normalizeCart(body.cart);
    if (cart.length === 0) {
      response.status(400).json({ error: 'Cart is empty.' });
      return;
    }

    const customer = body.customer && typeof body.customer === 'object' ? body.customer : {};
    const appUrl = getAppUrl();

    const lineItems = cart.flatMap((item) => [
      ['line_items[][price_data][currency]', 'usd'],
      ['line_items[][price_data][product_data][name]', item.name],
      ['line_items[][price_data][product_data][description]', item.size ? `Size ${item.size}` : ''],
      ['line_items[][price_data][unit_amount]', String(Math.round(item.price * 100))],
      ['line_items[][quantity]', String(item.quantity)],
    ]);

    const formEntries = [
      ['mode', 'payment'],
      ['billing_address_collection', 'required'],
      ['phone_number_collection[enabled]', 'true'],
      ['shipping_address_collection[allowed_countries][]', 'US'],
      ['success_url', `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`],
      ['cancel_url', `${appUrl}/checkout/cancel`],
      ...lineItems,
      ['metadata[customer_name]', typeof customer.name === 'string' ? customer.name : ''],
      ['metadata[customer_phone]', typeof customer.phone === 'string' ? customer.phone : ''],
      ['metadata[shipping_address]', typeof customer.address === 'string' ? customer.address : ''],
    ];

    if (typeof customer.email === 'string' && customer.email.trim()) {
      formEntries.push(['customer_email', customer.email.trim()]);
    }

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formEntries),
    });

    const payload = await stripeResponse.json();

    if (!stripeResponse.ok || typeof payload.url !== 'string') {
      const message = payload?.error?.message || 'Stripe checkout session could not be created.';
      response.status(400).json({ error: message });
      return;
    }

    response.status(200).json({ url: payload.url });
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : 'Checkout could not be created.',
    });
  }
}
