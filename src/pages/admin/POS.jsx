import React, { useState } from 'react';
import base44  from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Trash2, Search, ShoppingCart, Package, Loader2 } from 'lucide-react';
import { formatRupiah } from '@/lib/cartStore';
import { toast } from 'sonner';

export default function POS() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [bayar, setBayar] = useState('');
  const [metode, setMetode] = useState('Tunai');
  const [processing, setProcessing] = useState(false);
  const qc = useQueryClient();

  const { data: produkList = [] } = useQuery({
    queryKey: ['pos-produk'],
    queryFn: () => base44.entities.Produk.filter({ aktif: true }),
  });

  const filtered = produkList.filter(p => p.nama_produk.toLowerCase().includes(search.toLowerCase()) && p.stok > 0);

  const addItem = (p) => {
    setCart(prev => {
      const existing = prev.find(item => item.produk_id === p.id);
      if (existing) {
        return prev.map(item => item.produk_id === p.id
          ? { ...item, jumlah: item.jumlah + 1, subtotal: (item.jumlah + 1) * item.harga }
          : item
        );
      }
      return [...prev, { produk_id: p.id, nama_produk: p.nama_produk, harga: p.harga, jumlah: 1, subtotal: p.harga }];
    });
  };

  const updateQty = (produkId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.produk_id !== produkId) return item;
      const newQty = item.jumlah + delta;
      if (newQty <= 0) return null;
      return { ...item, jumlah: newQty, subtotal: newQty * item.harga };
    }).filter(Boolean));
  };

  const removeItem = (produkId) => setCart(prev => prev.filter(i => i.produk_id !== produkId));

  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  const kembalian = Number(bayar) - total;

  const handleCheckout = async () => {
    if (cart.length === 0) { toast.error('Keranjang kosong'); return; }
    if (metode === 'Tunai' && Number(bayar) < total) { toast.error('Uang bayar kurang'); return; }
    setProcessing(true);

    await base44.entities.Transaksi.create({
      items: cart,
      total,
      bayar: Number(bayar) || total,
      kembalian: metode === 'Tunai' ? Math.max(0, kembalian) : 0,
      metode_bayar: metode,
    });

    // Update stok
    for (const item of cart) {
      const produk = produkList.find(p => p.id === item.produk_id);
      if (produk) {
        await base44.entities.Produk.update(item.produk_id, { stok: Math.max(0, produk.stok - item.jumlah) });
      }
    }

    qc.invalidateQueries({ queryKey: ['pos-produk'] });
    setCart([]);
    setBayar('');
    setProcessing(false);
    toast.success('Transaksi berhasil!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Transaksi POS</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Product list */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => addItem(p)}
                className="text-left p-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all"
              >
                <div className="w-full aspect-square rounded-lg bg-muted mb-2 overflow-hidden">
                  {p.gambar ? <img src={p.gambar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-muted-foreground/30" /></div>}
                </div>
                <p className="font-medium text-sm truncate">{p.nama_produk}</p>
                <p className="text-primary font-bold text-sm">{formatRupiah(p.harga)}</p>
                <p className="text-xs text-muted-foreground">Stok: {p.stok}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-2">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Keranjang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">Pilih produk untuk memulai</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.produk_id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.nama_produk}</p>
                        <p className="text-xs text-muted-foreground">{formatRupiah(item.harga)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.produk_id, -1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.jumlah}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.produk_id, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold w-20 text-right">{formatRupiah(item.subtotal)}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.produk_id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatRupiah(total)}</span>
                </div>
                <Select value={metode} onValueChange={setMetode}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tunai">Tunai</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="QRIS">QRIS</SelectItem>
                  </SelectContent>
                </Select>
                {metode === 'Tunai' && (
                  <>
                    <Input type="number" placeholder="Jumlah bayar" value={bayar} onChange={e => setBayar(e.target.value)} className="rounded-xl" />
                    {Number(bayar) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kembalian</span>
                        <span className={`font-semibold ${kembalian >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {formatRupiah(Math.max(0, kembalian))}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <Button onClick={handleCheckout} disabled={processing || cart.length === 0} className="w-full rounded-xl">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Bayar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}