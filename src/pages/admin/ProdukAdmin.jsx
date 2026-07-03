import React, { useState } from 'react';
import  base44  from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Package, Search, Upload, Loader2 } from 'lucide-react';
import { formatRupiah } from '@/lib/cartStore';
import { toast } from 'sonner';

const KATEGORI = ['Galon Isi Ulang', 'Galon Baru', 'Gas Isi Ulang', 'Gas Baru', 'Lainnya'];
const emptyForm = { nama_produk: '', harga: '', stok: '', kategori: 'Galon Isi Ulang', deskripsi: '', gambar: '', aktif: true };

export default function ProdukAdmin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const { data: produkList = [], isLoading } = useQuery({
    queryKey: ['admin-produk'], queryFn: () => base44.entities.Produk.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.Produk.update(editId, data) : base44.entities.Produk.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-produk'] });
      setDialogOpen(false);
      toast.success(editId ? 'Produk diperbarui' : 'Produk ditambahkan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Produk.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-produk'] });
      toast.success('Produk dihapus');
    },
  });

  const openNew = () => { setForm(emptyForm); setEditId(null); setDialogOpen(true); };
  const openEdit = (p) => {
    setForm({ nama_produk: p.nama_produk, harga: p.harga, stok: p.stok, kategori: p.kategori, deskripsi: p.deskripsi || '', gambar: p.gambar || '', aktif: p.aktif !== false });
    setEditId(p.id);
    setDialogOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, harga: Number(form.harga), stok: Number(form.stok) });
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, gambar: file_url }));
    setUploading(false);
  };

  const filtered = produkList.filter(p => p.nama_produk.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Produk</h1>
          <p className="text-muted-foreground">{produkList.length} produk</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Tambah Produk
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Produk</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Kategori</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Harga</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Stok</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        {p.gambar ? <img src={p.gambar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-muted-foreground/40" /></div>}
                      </div>
                      <span className="font-medium text-foreground">{p.nama_produk}</span>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant="outline">{p.kategori}</Badge></td>
                  <td className="p-4 text-right font-medium">{formatRupiah(p.harga)}</td>
                  <td className="p-4 text-right">{p.stok}</td>
                  <td className="p-4 text-center">
                    <Badge className={p.aktif !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {p.aktif !== false ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Produk *</Label>
              <Input value={form.nama_produk} onChange={e => setForm({ ...form, nama_produk: e.target.value })} required className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga *</Label>
                <Input type="number" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Stok *</Label>
                <Input type="number" value={form.stok} onChange={e => setForm({ ...form, stok: e.target.value })} required className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={form.kategori} onValueChange={v => setForm({ ...form, kategori: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KATEGORI.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gambar</Label>
              <div className="flex items-center gap-3">
                {form.gambar && <img src={form.gambar} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Mengupload...' : 'Upload Gambar'}
                  </div>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} className="rounded-xl" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Batal</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="rounded-xl">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}