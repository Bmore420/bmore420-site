import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getCartItemCount, readCart, subscribeToCart } from '../cart';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartItemCount(readCart()));
    syncCartCount();
    return subscribeToCart(syncCartCount);
  }, []);

  return (
    <nav className="bg-black shadow-[inset_0_-1px_0_rgba(255,255,255,0.75)] w-full z-40 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src="/images/1024/24684714/Bmore420Mdlogoaaaa-xk3v1iHXQD2-Hx-RdOUPTA.png"
                alt="Bmore420 Logo"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary transition-colors text-lg font-semibold">Home</Link>
            <Link to="/events" className="text-white hover:text-primary transition-colors text-lg font-semibold">Events</Link>
            <Link to="/blog" className="text-white hover:text-primary transition-colors text-lg font-semibold">Blog</Link>
            <Link to="/contact" className="text-white hover:text-primary transition-colors text-lg font-semibold">Contact</Link>
            <Link to="/shop" className="text-white hover:text-primary transition-colors text-lg font-semibold">Shop</Link>
            <Link to="/cart" className="relative text-white hover:text-primary transition-colors" aria-label="Cart">
              <ShoppingCart className="h-7 w-7" />
              <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-primary text-[11px] font-bold text-white flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-6 w-6"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link onClick={() => setIsOpen(false)} to="/" className="text-white hover:text-primary block px-3 py-4 text-xl font-medium">Home</Link>
            <Link onClick={() => setIsOpen(false)} to="/events" className="text-white hover:text-primary block px-3 py-4 text-xl font-medium">Events</Link>
            <Link onClick={() => setIsOpen(false)} to="/blog" className="text-white hover:text-primary block px-3 py-4 text-xl font-medium">Blog</Link>
            <Link onClick={() => setIsOpen(false)} to="/contact" className="text-white hover:text-primary block px-3 py-4 text-xl font-medium">Contact</Link>
            <Link onClick={() => setIsOpen(false)} to="/shop" className="bg-primary hover:bg-green-600 text-white block px-6 py-4 mt-2 rounded-md text-xl font-bold w-[80%] text-center">Shop</Link>
            <Link onClick={() => setIsOpen(false)} to="/cart" className="text-white hover:text-primary block px-3 py-4 text-xl font-medium">
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
