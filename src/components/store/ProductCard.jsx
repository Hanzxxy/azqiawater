import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { addToCart, formatRupiah } from '@/lib/cartStore';
import { toast } from 'sonner';
import StarRating from './StarRating';

export default function ProductCard({ produk, avgRating = null, totalUlasan = 0, onUlasanClick }) {
  const handleAdd = (e) => {
    e.stopPropagation();
    if (produk.stok <= 0) return;
    addToCart(produk);
    toast.success(`${produk.nama_produk} ditambahkan ke keranjang`);
  };

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {produk.gambar ? (
          <img src={produk.gambar} alt={produk.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs">
          {produk.kategori}
        </Badge>
        {produk.stok <= 0 && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-destructive font-bold text-lg">Habis</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-snug">{produk.nama_produk}</h3>
        {produk.deskripsi && (
          <p className="text-xs text-muted-foreground line-clamp-2">{produk.deskripsi}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating value={avgRating ? Math.round(avgRating) : 0} readOnly size="sm" />
          {avgRating ? (
            <span className="text-xs text-muted-foreground">({totalUlasan})</span>
          ) : (
            <span className="text-xs text-muted-foreground">Belum ada ulasan</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">{formatRupiah(produk.harga)}</span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={produk.stok <= 0}
            className="rounded-xl gap-1.5 text-xs"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">Stok: {produk.stok}</p>
          {onUlasanClick && (
            <button
              onClick={onUlasanClick}
              className="text-[11px] text-primary underline underline-offset-2 hover:opacity-80"
            >
              Lihat ulasan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}