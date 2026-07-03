import React, { useMemo } from 'react';
import  base44  from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/lib/cartStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, isAfter } from 'date-fns';
import { id } from 'date-fns/locale';
import { TrendingUp, ShoppingCart, ClipboardList, DollarSign } from 'lucide-react';

const COLORS = ['hsl(142,71%,35%)', 'hsl(173,58%,39%)', 'hsl(43,74%,66%)', 'hsl(12,76%,61%)', 'hsl(197,37%,24%)', 'hsl(27,87%,67%)'];

export default function Laporan() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list('-created_date'),
  });
  const { data: transaksi = [] } = useQuery({
    queryKey: ['admin-transaksi'], queryFn: () => base44.entities.Transaksi.list('-created_date'),
  });

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const label = format(date, 'dd MMM', { locale: id });

      const orderRev = orders
        .filter(o => o.status === 'Selesai' && o.created_date && o.created_date.startsWith(dateStr))
        .reduce((s, o) => s + (o.total || 0), 0);

      const transRev = transaksi
        .filter(t => t.created_date && t.created_date.startsWith(dateStr))
        .reduce((s, t) => s + (t.total || 0), 0);

      days.push({ name: label, Online: orderRev, POS: transRev });
    }
    return days;
  }, [orders, transaksi]);

  const kategorData = useMemo(() => {
    const map = {};
    [...orders.filter(o => o.status === 'Selesai'), ...transaksi].forEach(t => {
      (t.items || []).forEach(item => {
        const name = item.nama_produk || 'Lainnya';
        map[name] = (map[name] || 0) + (item.subtotal || 0);
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
  }, [orders, transaksi]);

  const totalOnline = orders.filter(o => o.status === 'Selesai').reduce((s, o) => s + (o.total || 0), 0);
  const totalPOS = transaksi.reduce((s, t) => s + (t.total || 0), 0);
  const totalAll = totalOnline + totalPOS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Laporan</h1>
        <p className="text-muted-foreground">Ringkasan pendapatan dan penjualan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pendapatan</p>
              <p className="text-xl font-bold">{formatRupiah(totalAll)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Penjualan Online</p>
              <p className="text-xl font-bold">{formatRupiah(totalOnline)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Penjualan POS</p>
              <p className="text-xl font-bold">{formatRupiah(totalPOS)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Pendapatan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatRupiah(v)} />
                  <Bar dataKey="Online" fill="hsl(142,71%,35%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="POS" fill="hsl(43,74%,66%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            {kategorData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">Belum ada data</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={kategorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                      {kategorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatRupiah(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}