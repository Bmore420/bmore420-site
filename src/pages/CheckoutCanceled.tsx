import { Link } from 'react-router-dom';

export default function CheckoutCanceled() {
  return (
    <div className="w-full py-24 px-4 min-h-[70vh]">
      <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Stripe Checkout</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Checkout Canceled</h1>
        <p className="mt-4 text-lg text-gray-200">
          No charge was made. Your cart is still here if you want to try again.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/cart"
            className="rounded-full bg-primary px-6 py-4 font-bold text-white transition-colors hover:bg-green-600"
          >
            Return To Cart
          </Link>
          <Link
            to="/shop"
            className="rounded-full border border-white/15 bg-black/35 px-6 py-4 font-bold text-white transition-colors hover:border-primary/60"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
