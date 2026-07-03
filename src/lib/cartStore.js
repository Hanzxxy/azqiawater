// Simple cart store using localStorage
const CART_KEY = 'toko_cart';

export function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToCart(produk, jumlah = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.produk_id === produk.id);
  if (existing) {
    existing.jumlah += jumlah;
    existing.subtotal = existing.jumlah * existing.harga;
  } else {
    cart.push({
      produk_id: produk.id,
      nama_produk: produk.nama_produk,
      harga: produk.harga,
      gambar: produk.gambar,
      jumlah,
      subtotal: produk.harga * jumlah,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function updateCartItem(produkId, jumlah) {
  let cart = getCart();
  if (jumlah <= 0) {
    cart = cart.filter(item => item.produk_id !== produkId);
  } else {
    const item = cart.find(item => item.produk_id === produkId);
    if (item) {
      item.jumlah = jumlah;
      item.subtotal = item.jumlah * item.harga;
    }
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function removeFromCart(produkId) {
  let cart = getCart().filter(item => item.produk_id !== produkId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-updated'));
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.subtotal, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.jumlah, 0);
}

export function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}