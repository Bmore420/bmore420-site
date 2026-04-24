import crypto from 'node:crypto';
import { sendSaleNotifications } from '../stripeNotifications.mjs';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

function verifySignature(rawBody, signatureHeader) {
  if (!STRIPE_WEBHOOK_SECRET) throw new Error('Missing STRIPE_WEBHOOK_SECRET.');
  if (!signatureHeader) throw new Error('Missing Stripe signature header.');

  const parts = Object.fromEntries(
    signatureHeader
      .split(',')
      .map((entry) => entry.trim().split('='))
      .filter(([k, v]) => k && v),
  );

  if (!parts.t || !parts.v1) throw new Error('Invalid Stripe signature header.');

  const expected = crypto
    .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
    .update(`${parts.t}.${rawBody.toString('utf8')}`, 'utf8')
    .digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(parts.v1, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error('Invalid Stripe webhook signature.');
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const rawBody = await readRawBody(request);
    verifySignature(rawBody, request.headers['stripe-signature']);

    const event = JSON.parse(rawBody.toString('utf8'));
    if (event.type === 'checkout.session.completed') {
      const notificationResult = await sendSaleNotifications(event);
      console.log('Stripe checkout completed', {
        sessionId: event.data?.object?.id,
        amountTotal: event.data?.object?.amount_total,
        notificationChannels: notificationResult.channels,
      });
    }

    response.status(200).json({ received: true });
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : 'Webhook could not be processed.',
    });
  }
}
