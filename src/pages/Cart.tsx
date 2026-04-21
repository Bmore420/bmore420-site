import { useEffect, useMemo, useState } from 'react';
import {
  getCartItemCount,
  getCartSubtotal,
  readCart,
  subscribeToCart,
  updateCartItemQuantity,
  type CartItem,
} from '../cart';
import { apiUrl } from '../apiBase';

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutError, setCheckoutError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setCart(readCart());
    return subscribeToCart(() => setCart(readCart()));
  }, []);

  const totalItems = useMemo(() => getCartItemCount(cart), [cart]);
  const subtotal = useMemo(() => getCartSubtotal(cart), [cart]);

  const handleCheckout = async () => {
    setCheckoutError('');

    if (cart.length === 0) {
      return;
    }

    setIsRedirecting(true);

    try {
      const response = await fetch(apiUrl('/api/create-checkout-session'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      const raw = await response.text();
      const payload = raw ? (JSON.parse(raw) as { url?: string; error?: string }) : {};

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Stripe checkout could not be started.');
      }

      window.location.href = payload.url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Stripe checkout could not be started.');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="w-full py-24 px-4 min-h-[70vh]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Cart</h1>
          <p className="text-lg text-gray-200">
            Review your order, adjust quantities, and complete checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] gap-10 items-start">
          <section className="rounded-3xl border border-white/10 bg-black/45 p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-3xl font-bold text-white">Your Items</h2>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-sm text-primary">
                {totalItems} item{totalItems === 1 ? '' : 's'}
              </span>
            </div>

            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-300">Your cart is empty. Add products from the shop page to review them here.</p>
              ) : (
                cart.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="text-sm text-gray-300 mt-1">Size {item.size}</p>
                      </div>
                      <p className="font-semibold text-primary">${item.price * item.quantity}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.productId, item.size, item.quantity - 1)}
                          className="h-10 w-10 rounded-full border border-white/15 bg-black/30 text-white"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center font-semibold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.productId, item.size, item.quantity + 1)}
                          className="h-10 w-10 rounded-full border border-white/15 bg-black/30 text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.productId, item.size, 0)}
                        className="text-sm text-gray-300 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-3xl font-bold text-white mb-5">Order Summary</h2>
              <div className="space-y-3 text-gray-200">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>${subtotal}</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-3xl font-bold text-white mb-3">Checkout</h2>
              <p className="text-gray-300 mb-6">
                You'll be taken to Stripe's secure checkout page to enter shipping and payment details.
              </p>

              {checkoutError ? (
                <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 mb-4">
                  {checkoutError}
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={cart.length === 0 || isRedirecting}
                className="w-full rounded-full bg-primary hover:bg-green-600 disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 transition-colors"
              >
                {isRedirecting ? 'Redirecting to Stripe...' : 'Checkout with Stripe'}
              </button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Secure checkout powered by Stripe.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
