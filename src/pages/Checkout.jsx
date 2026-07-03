import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import base44 from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { MessageCircle, Loader2 } from 'lucide-react';

import {
  getCart,
  getCartTotal,
  clearCart,
  formatRupiah
} from '@/lib/cartStore';

import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(getCart());

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: '',
    alamat: '',
    no_hp: '',
    catatan: '',
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Setting.list(),
  });

  const setting = settings[0];

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/keranjang');
    }
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.alamat || !form.no_hp) {
      toast.error('Lengkapi semua data');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        nama_pembeli: form.nama,
        alamat: form.alamat,
        no_hp: form.no_hp,
        catatan: form.catatan,

        items: cart.map((item) => ({
          produk_id: item.produk_id,
          nama_produk: item.nama_produk,
          harga: item.harga,
          jumlah: item.jumlah,
          subtotal: item.subtotal,
        })),

        total: getCartTotal(),
        status: 'Menunggu',
      };

      await base44.entities.Order.create(orderData);

      // TEMPLATE WHATSAPP
      let msg = `╔══════════════════╗\n`;
      msg += `🛒 *PESANAN BARU MASUK* 🛒\n`;
      msg += `╚══════════════════╝\n\n`;

      msg += `👤 *DATA PEMBELI*\n`;
      msg += `━━━━━━━━━━━━━━\n`;
      msg += `🙍 Nama : ${form.nama}\n`;
      msg += `📱 No HP : ${form.no_hp}\n`;
      msg += `📍 Alamat : ${form.alamat}\n`;

      if (form.catatan) {
        msg += `📝 Catatan : ${form.catatan}\n`;
      }

      msg += `\n`;
      msg += `📦 *DETAIL PESANAN*\n`;
      msg += `━━━━━━━━━━━━━━\n`;

      cart.forEach((item) => {
        const nama = item.nama_produk.toLowerCase();

        let emoji = '🛍️';

        if (
          nama.includes('gas') ||
          nama.includes('lpg')
        ) {
          emoji = '🔥';
        } else if (
          nama.includes('galon') ||
          nama.includes('aqua') ||
          nama.includes('cleo') ||
          nama.includes('le minerale')
        ) {
          emoji = '💧';
        }

        msg += `${emoji} *${item.nama_produk}*\n`;
        msg += `   └ Jumlah : ${item.jumlah}\n`;
        msg += `   └ Harga : ${formatRupiah(item.harga)}\n`;
        msg += `   └ Subtotal : ${formatRupiah(item.subtotal)}\n\n`;
      });

      msg += `━━━━━━━━━━━━━━\n`;
      msg += `💰 *TOTAL PEMBAYARAN*\n`;
      msg += `✨ ${formatRupiah(getCartTotal())}\n`;
      msg += `━━━━━━━━━━━━━━\n\n`;

      msg += `🙏 Terima kasih sudah memesan di toko kami\n`;
      msg += `🚚 Pesanan siap diproses`;

      const rawNumber =
        setting?.no_hp_admin || '6285782232396';

      const waNumber = rawNumber
        .replace(/\D/g, '')
        .replace(/^0/, '62');

      // FIX EMOJI WHATSAPP
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

      clearCart();

      toast.success('Pesanan berhasil dibuat');

      // PINDAH KE WHATSAPP ADMIN
      window.location.href = waUrl;

    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Checkout
      </h1>

      <p className="text-muted-foreground mb-8">
        Lengkapi data Anda untuk menyelesaikan pesanan
      </p>

      {/* Ringkasan */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">
          Ringkasan Pesanan
        </h2>

        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.produk_id}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {item.nama_produk} x{item.jumlah}
              </span>

              <span className="font-medium">
                {formatRupiah(item.subtotal)}
              </span>
            </div>
          ))}

          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold">
              Total
            </span>

            <span className="font-bold text-primary text-lg">
              {formatRupiah(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl border border-border p-6 space-y-5"
      >
        <h2 className="font-semibold text-foreground">
          Data Pembeli
        </h2>

        <div className="space-y-2">
          <Label>Nama Lengkap *</Label>

          <Input
            placeholder="Masukkan nama lengkap"
            value={form.nama}
            onChange={(e) =>
              setForm({
                ...form,
                nama: e.target.value,
              })
            }
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Alamat Pengiriman *</Label>

          <Textarea
            placeholder="Masukkan alamat lengkap"
            value={form.alamat}
            onChange={(e) =>
              setForm({
                ...form,
                alamat: e.target.value,
              })
            }
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>No. HP (WhatsApp) *</Label>

          <Input
            placeholder="081234567890"
            value={form.no_hp}
            onChange={(e) =>
              setForm({
                ...form,
                no_hp: e.target.value,
              })
            }
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Catatan</Label>

          <Textarea
            placeholder="Catatan tambahan..."
            value={form.catatan}
            onChange={(e) =>
              setForm({
                ...form,
                catatan: e.target.value,
              })
            }
            className="rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl gap-2 text-base py-6 bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              Pesan via WhatsApp
            </>
          )}
        </Button>
      </form>
    </div>
  );
}