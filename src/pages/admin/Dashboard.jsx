import React from 'react';
import base44  from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ClipboardList, ShoppingCart, TrendingUp } from 'lucide-react';
import { formatRupiah } from '@/lib/cartStore';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { data: produkList = [] } = useQuery({
    queryKey: ['admin-produk'], queryFn: () => base44.entities.Produk.list(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list('-created_date', 50),
  });
  const { data: transaksi = [] } = useQuery({
    queryKey: ['admin-transaksi'], queryFn: () => base44.entities.Transaksi.list('-created_date', 50),
  });

  const totalProduk = produkList.length;
  const totalOrder = orders.length;
  const orderMenunggu = orders.filter(o => o.status === 'Menunggu').length;
  const totalPendapatan = [...orders.filter(o => o.status === 'Selesai'), ...transaksi].reduce((s, t) => s + (t.total || 0), 0);

  const stats = [
    { label: 'Total Produk', value: totalProduk, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Pesanan', value: totalOrder, icon: ClipboardList, color: 'text-amber-600 bg-amber-50' },
    { label: 'Pesanan Menunggu', value: orderMenunggu, icon: ShoppingCart, color: 'text-red-600 bg-red-50' },
    { label: 'Total Pendapatan', value: formatRupiah(totalPendapatan), icon: TrendingUp, color: 'text-primary bg-accent' },
  ];

  const recentOrders = orders.slice(0, 5);

  const statusColor = {
    Menunggu: 'bg-amber-100 text-amber-800',
    Diproses: 'bg-blue-100 text-blue-800',
    Dikirim: 'bg-purple-100 text-purple-800',
    Selesai: 'bg-green-100 text-green-800',
    Dibatalkan: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan toko Anda</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada pesanan</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{order.nama_pembeli}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.created_date ? format(new Date(order.created_date), 'dd MMM yyyy HH:mm', { locale: id }) : '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{formatRupiah(order.total)}</span>
                    <Badge className={statusColor[order.status] || 'bg-muted text-muted-foreground'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}