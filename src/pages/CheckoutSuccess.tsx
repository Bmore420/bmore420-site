import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clearCart } from '../cart';
import { apiUrl } from '../apiBase';

export default function CheckoutSuccess() {
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'pending' | 'error'>('checking');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    const statusUrl = apiUrl(`/api/checkout-session-status?session_id=${encodeURIComponent(sessionId)}`);

    const checkStatus = async () => {
      try {
        const response = await fetch(statusUrl);
        const payload = (await response.json()) as {
          found?: boolean;
          order?: { status?: string } | null;
        };

        if (payload.found && payload.order?.status === 'paid') {
          clearCart();
          setStatus('confirmed');
          return;
        }

        setStatus('pending');
      } catch {
        setStatus('error');
      }
    };

    void checkStatus();
  }, []);

  return (
    <div className="w-full py-24 px-4 min-h-[70vh]">
      <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Stripe Checkout</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">
          {status === 'confirmed' ? 'Payment Verified' : 'Payment Processing'}
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          {status === 'confirmed'
            ? 'Stripe confirmed the checkout session and the cart has been cleared.'
            : status === 'pending'
              ? 'Stripe redirected back successfully, but the webhook has not confirmed payment yet.'
              : status === 'error'
                ? 'The success page could not verify the Stripe session.'
                : 'Checking Stripe payment status now.'}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/shop"
            className="rounded-full bg-primary px-6 py-4 font-bold text-white transition-colors hover:bg-green-600"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/15 bg-black/35 px-6 py-4 font-bold text-white transition-colors hover:border-primary/60"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
