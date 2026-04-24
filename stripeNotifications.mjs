const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SALE_NOTIFICATION_EMAIL_TO = process.env.SALE_NOTIFICATION_EMAIL_TO;
const SALE_NOTIFICATION_EMAIL_FROM = process.env.SALE_NOTIFICATION_EMAIL_FROM;
const SALE_NOTIFICATION_WEBHOOK_URL = process.env.SALE_NOTIFICATION_WEBHOOK_URL;

function toTitleCase(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCurrency(amountTotal, currency) {
  if (typeof amountTotal !== 'number') {
    return 'Unknown';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: typeof currency === 'string' ? currency.toUpperCase() : 'USD',
    }).format(amountTotal / 100);
  } catch {
    return `$${(amountTotal / 100).toFixed(2)}`;
  }
}

function formatAddress(address) {
  if (!address || typeof address !== 'object') {
    return '';
  }

  const parts = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(', '),
    address.postal_code,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
}

function getOrderDetails(event) {
  const session = event?.data?.object ?? {};
  const metadata = session.metadata && typeof session.metadata === 'object' ? session.metadata : {};
  const customerDetails =
    session.customer_details && typeof session.customer_details === 'object'
      ? session.customer_details
      : {};
  const shippingDetails =
    session.shipping_details && typeof session.shipping_details === 'object'
      ? session.shipping_details
      : {};

  return {
    eventId: typeof event?.id === 'string' ? event.id : '',
    sessionId: typeof session.id === 'string' ? session.id : '',
    amountTotal:
      typeof session.amount_total === 'number'
        ? session.amount_total
        : Number.parseInt(session.amount_total || '', 10),
    currency: typeof session.currency === 'string' ? session.currency : 'usd',
    customerName:
      customerDetails.name || shippingDetails.name || metadata.customer_name || 'Unknown customer',
    customerEmail: customerDetails.email || session.customer_email || '',
    customerPhone: customerDetails.phone || metadata.customer_phone || '',
    shippingAddress:
      formatAddress(shippingDetails.address) ||
      formatAddress(customerDetails.address) ||
      metadata.shipping_address ||
      '',
    orderSummary: metadata.order_summary || '',
    itemCount: metadata.item_count || '',
    livemode: Boolean(event?.livemode),
  };
}

function buildNotificationContent(order) {
  const amount = formatCurrency(order.amountTotal, order.currency);
  const modeLabel = order.livemode ? 'LIVE' : 'TEST';
  const lines = [
    `Stripe sale received (${modeLabel})`,
    `Amount: ${amount}`,
    `Session ID: ${order.sessionId || 'Unknown'}`,
    `Customer: ${order.customerName}`,
  ];

  if (order.customerEmail) {
    lines.push(`Email: ${order.customerEmail}`);
  }

  if (order.customerPhone) {
    lines.push(`Phone: ${order.customerPhone}`);
  }

  if (order.shippingAddress) {
    lines.push(`Shipping: ${order.shippingAddress}`);
  }

  if (order.itemCount) {
    lines.push(`Items: ${order.itemCount}`);
  }

  if (order.orderSummary) {
    lines.push(`Order: ${order.orderSummary}`);
  }

  if (order.eventId) {
    lines.push(`Event ID: ${order.eventId}`);
  }

  return {
    subject: `[${modeLabel}] New Bmore420 sale: ${amount}`,
    text: lines.join('\n'),
    html: `
      <h2>Stripe sale received (${modeLabel})</h2>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Session ID:</strong> ${order.sessionId || 'Unknown'}</p>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      ${order.customerEmail ? `<p><strong>Email:</strong> ${order.customerEmail}</p>` : ''}
      ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ''}
      ${order.shippingAddress ? `<p><strong>Shipping:</strong> ${order.shippingAddress}</p>` : ''}
      ${order.itemCount ? `<p><strong>Items:</strong> ${order.itemCount}</p>` : ''}
      ${order.orderSummary ? `<p><strong>Order:</strong> ${order.orderSummary}</p>` : ''}
      ${order.eventId ? `<p><strong>Event ID:</strong> ${order.eventId}</p>` : ''}
    `,
    webhookPayload: {
      type: 'stripe.sale',
      mode: order.livemode ? 'live' : 'test',
      amount,
      sessionId: order.sessionId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      itemCount: order.itemCount,
      orderSummary: order.orderSummary,
      eventId: order.eventId,
    },
  };
}

async function sendResendEmail(content) {
  if (!RESEND_API_KEY || !SALE_NOTIFICATION_EMAIL_TO || !SALE_NOTIFICATION_EMAIL_FROM) {
    return false;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SALE_NOTIFICATION_EMAIL_FROM,
      to: [SALE_NOTIFICATION_EMAIL_TO],
      subject: content.subject,
      text: content.text,
      html: content.html,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Resend notification failed: ${payload || response.status}`);
  }

  return true;
}

async function sendWebhook(content) {
  if (!SALE_NOTIFICATION_WEBHOOK_URL) {
    return false;
  }

  const response = await fetch(SALE_NOTIFICATION_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content.webhookPayload),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Sale webhook failed: ${payload || response.status}`);
  }

  return true;
}

export function summarizeCartForMetadata(cart) {
  const summary = cart
    .map((item) => `${item.quantity}x ${item.name}${item.size ? ` (${toTitleCase(item.size)})` : ''}`)
    .join(', ');

  return summary.slice(0, 500);
}

export async function sendSaleNotifications(event) {
  const order = getOrderDetails(event);
  const content = buildNotificationContent(order);
  const channels = [];

  if (await sendResendEmail(content)) {
    channels.push('email');
  }

  if (await sendWebhook(content)) {
    channels.push('webhook');
  }

  return {
    order,
    channels,
  };
}
