import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addItemToCart, products, sizes, type ProductId, type ShirtSize } from '../cart';

export default function Shop() {
  const [selectedSizes, setSelectedSizes] = useState<Record<ProductId, ShirtSize>>({
    'shirt-circle': 'M',
    'shirt-stripe': 'M',
    'shirt-bmore': 'M',
  });
  const [justAdded, setJustAdded] = useState<Partial<Record<ProductId, boolean>>>({});

  const updateSelectedSize = (productId: ProductId, size: ShirtSize) => {
    setSelectedSizes((current) => ({
      ...current,
      [productId]: size,
    }));
  };

  const handleAddToCart = (productId: ProductId) => {
    addItemToCart(productId, selectedSizes[productId]);
    setJustAdded((current) => ({
      ...current,
      [productId]: true,
    }));

    window.setTimeout(() => {
      setJustAdded((current) => ({
        ...current,
        [productId]: false,
      }));
    }, 1200);
  };

  return (
    <div className="w-full py-24 px-4 min-h-[70vh]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12">
          <h1 className="inline-block rounded-2xl bg-primary px-8 py-4 text-4xl md:text-5xl font-bold text-white shadow-xl mb-4">
            SHOP
          </h1>
          <p className="text-lg text-gray-200">
            Browse the current collection in one dedicated place.
          </p>
          <p className="text-lg italic text-gray-200">
            Shipping is always free when you purchase directly from us!
          </p>
          <div className="mt-6">
            <Link
              to="/cart"
              className="inline-block rounded-full border border-white/15 bg-black/35 px-6 py-3 text-white font-bold transition-colors hover:border-primary/60 hover:text-primary"
            >
              View Cart
            </Link>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-[0_0_20px_rgba(0,176,7,0.08)]"
            >
              <div className="bg-[#111] p-5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                    <p className="text-primary font-semibold mt-2">$30</p>
                  </div>
                  <span className="rounded-full border border-primary/40 px-3 py-1 text-sm text-primary">
                    Free Shipping
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-3">Sizes</p>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size) => {
                      const isSelected = selectedSizes[product.id] === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateSelectedSize(product.id, size)}
                          className={`rounded-xl border px-4 py-3 font-semibold transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-white/15 bg-black/30 text-gray-200 hover:border-primary/60'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                  className={`w-full mt-6 rounded-full font-bold py-4 px-6 transition-all ${
                    justAdded[product.id]
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                      : 'bg-primary hover:bg-green-600 text-white'
                  }`}
                >
                  {justAdded[product.id] ? 'Added To Cart' : 'Add To Cart'}
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
