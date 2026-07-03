import React from 'react';
import base44  from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/lib/cartStore';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { Phone, MapPin, User, Package } from 'lucide-react';

const STATUS_LIST = ['Menunggu', 'Selesai', 'Dibatalkan'];
const statusColor = {
  Menunggu: 'bg-amber-100 text-amber-800 border-amber-200',
  Selesai: 'bg-green-100 text-green-800 border-green-200',
  Dibatalkan: 'bg-red-100 text-red-800 border-red-200',
};

export default function PesananAdmin() {
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Status pesanan diperbarui');
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Kelola Pesanan</h1>
        <p className="text-muted-foreground">{orders.length} pesanan</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Belum ada pesanan</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {order.nama_pembeli}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.created_date ? format(new Date(order.created_date), 'dd MMM yyyy HH:mm', { locale: id }) : '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColor[order.status]}>{order.status}</Badge>
                    <Select
                      value={order.status}
                      onValueChange={(v) => updateMutation.mutate({ id: order.id, status: v })}
                    >
                      <SelectTrigger className="w-36 rounded-xl text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_LIST.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{order.alamat}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{order.no_hp}</span>
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3 h-3 text-muted-foreground" />
                          {item.nama_produk} x{item.jumlah}
                        </span>
                        <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end pt-1">
                  <span className="text-lg font-bold text-primary">{formatRupiah(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}