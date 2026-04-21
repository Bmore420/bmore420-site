const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!STRIPE_SECRET_KEY) {
    response.status(500).json({ error: 'Missing STRIPE_SECRET_KEY.' });
    return;
  }

  const sessionId = request.query?.session_id;
  if (!sessionId || typeof sessionId !== 'string') {
    response.status(400).json({ error: 'Missing session_id.' });
    return;
  }

  try {
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
      },
    );

    const session = await stripeResponse.json();
    if (!stripeResponse.ok) {
      response.status(400).json({ error: session?.error?.message || 'Stripe session lookup failed.' });
      return;
    }

    response.status(200).json({
      found: true,
      order: {
        sessionId: session.id,
        status: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email || session.customer_email || '',
        customerName: session.customer_details?.name || '',
      },
    });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Stripe session lookup failed.',
    });
  }
}
