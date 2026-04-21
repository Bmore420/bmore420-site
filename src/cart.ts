export const sizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const products = [
  {
    id: 'shirt-circle',
    name: 'Circle Maryland Tee',
    image: '/images/shop/shirt-circle.png',
    price: 30,
  },
  {
    id: 'shirt-stripe',
    name: 'Maryland Stripe Tee',
    image: '/images/shop/shirt-stripe.png',
    price: 30,
  },
  {
    id: 'shirt-bmore',
    name: 'Classic Bmore 420 Tee',
    image: '/images/shop/shirt-bmore.png',
    price: 30,
  },
] as const;

export type ProductId = (typeof products)[number]['id'];
export type ShirtSize = (typeof sizes)[number];

export type CartItem = {
  productId: ProductId;
  name: string;
  size: ShirtSize;
  price: number;
  quantity: number;
};

const CART_STORAGE_KEY = 'bmore420-cart';
const CART_UPDATED_EVENT = 'bmore420-cart-updated';

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(cart: CartItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function clearCart() {
  writeCart([]);
}

export function subscribeToCart(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleUpdate = () => callback();

  window.addEventListener('storage', handleUpdate);
  window.addEventListener(CART_UPDATED_EVENT, handleUpdate);

  return () => {
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
  };
}

export function getCartItemCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addItemToCart(productId: ProductId, size: ShirtSize) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    return;
  }

  const current = readCart();
  const existing = current.find((item) => item.productId === productId && item.size === size);

  const nextCart = existing
    ? current.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [
        ...current,
        {
          productId,
          name: product.name,
          size,
          price: product.price,
          quantity: 1,
        },
      ];

  writeCart(nextCart);
}

export function updateCartItemQuantity(productId: ProductId, size: ShirtSize, quantity: number) {
  const current = readCart();
  const nextCart =
    quantity <= 0
      ? current.filter((item) => !(item.productId === productId && item.size === size))
      : current.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item,
        );

  writeCart(nextCart);
}
