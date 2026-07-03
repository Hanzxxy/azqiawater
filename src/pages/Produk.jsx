import React, { useState } from 'react';
import  base44  from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/store/ProductCard';
import  UlasanSection  from '@/components/store/UlasanSection';

const KATEGORI_LIST = ['Semua', 'Galon Isi Ulang', 'Galon Baru', 'Gas Isi Ulang', 'Gas Baru', 'Lainnya'];

export default function Produk() {
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [selectedProduk, setSelectedProduk] = useState(null);

  const { data: produkList = [], isLoading } = useQuery({
    queryKey: ['produk-all'],
    queryFn: () => base44.entities.Produk.filter({ aktif: true }),
  });

  const { data: semuaUlasan = [] } = useQuery({
    queryKey: ['ulasan-all'],
    queryFn: () => base44.entities.Ulasan.list(),
  });

  const getRatingInfo = (produkId) => {
    const list = semuaUlasan.filter(u => u.produk_id === produkId);
    if (!list.length) return { avg: null, total: 0 };
    return { avg: list.reduce((s, u) => s + u.rating, 0) / list.length, total: list.length };
  };

  const filtered = produkList.filter(p => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === 'Semua' || p.kategori === kategori;
    return matchSearch && matchKategori;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Katalog Produk</h1>
        <p className="text-muted-foreground mt-1">Galon isi ulang, galon baru, gas 3kg & 12kg pink</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2">
          {KATEGORI_LIST.map(k => (
            <Badge
              key={k}
              variant={kategori === k ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1 text-xs rounded-xl transition-colors"
              onClick={() => setKategori(k)}
            >
              {k}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(0).map((_, i) => <div key={i} className="animate-pulse rounded-2xl bg-muted aspect-[3/4]" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Produk tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(p => {
            const { avg, total } = getRatingInfo(p.id);
            return (
              <ProductCard
                key={p.id}
                produk={p}
                avgRating={avg}
                totalUlasan={total}
                onUlasanClick={() => setSelectedProduk(p)}
              />
            );
          })}
        </div>
      )}

      {/* Drawer/Panel Ulasan */}
      {selectedProduk && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedProduk(null)} />
          <div className="relative z-10 bg-background w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground text-lg line-clamp-1">{selectedProduk.nama_produk}</h2>
              <button onClick={() => setSelectedProduk(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <UlasanSection produkId={selectedProduk.id} />
          </div>
        </div>
      )}
    </div>
  );
}