import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCart, updateCartItem, removeFromCart, formatRupiah, getCartTotal } from '@/lib/cartStore';
import { Package } from 'lucide-react';

export default function Keranjang() {
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const handleUpdate = () => setCart(getCart());
    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Keranjang Kosong</h2>
        <p className="text-muted-foreground mb-6">Belum ada produk di keranjang Anda</p>
        <Link to="/produk">
          <Button className="rounded-xl gap-2">
            Mulai Belanja <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Keranjang Belanja</h1>

      <div className="space-y-4 mb-8">
        {cart.map(item => (
          <div key={item.produk_id} className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
            <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0">
              {item.gambar ? (
                <img src={item.gambar} alt={item.nama_produk} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{item.nama_produk}</h3>
              <p className="text-sm text-primary font-medium">{formatRupiah(item.harga)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => updateCartItem(item.produk_id, item.jumlah - 1)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center font-medium text-sm">{item.jumlah}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => updateCartItem(item.produk_id, item.jumlah + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-right min-w-[100px]">
              <p className="font-semibold text-foreground">{formatRupiah(item.subtotal)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
              onClick={() => removeFromCart(item.produk_id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">{formatRupiah(getCartTotal())}</span>
        </div>
        <Link to="/checkout" className="block">
          <Button className="w-full rounded-xl gap-2 text-base py-6">
            Checkout <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}