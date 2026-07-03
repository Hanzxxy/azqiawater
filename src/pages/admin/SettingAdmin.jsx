import React, { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Upload,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

export default function SettingAdmin() {

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nama_toko: "",
    alamat_toko: "",
    no_hp_admin: "",
    deskripsi: "",
    logo: "",
  });

  // =========================
  // LOAD DATA DARI LOCALSTORAGE
  // =========================
  useEffect(() => {

    const saved = localStorage.getItem("setting_toko");

    if (saved) {
      setForm(JSON.parse(saved));
    }

  }, []);

  // =========================
  // UPLOAD FOTO BASE64
  // =========================
  const handleUpload = (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    try {

      setUploading(true);

      const reader = new FileReader();

      reader.onloadend = () => {

        setForm((prev) => ({
          ...prev,
          logo: reader.result,
        }));

        toast.success("Logo berhasil dipilih");

        setUploading(false);
      };

      reader.readAsDataURL(file);

    } catch (err) {

      console.log(err);

      toast.error("Upload gagal");

      setUploading(false);
    }
  };

  // =========================
  // SIMPAN
  // =========================
  const handleSave = () => {

    localStorage.setItem(
      "setting_toko",
      JSON.stringify(form)
    );

    toast.success("Setting berhasil disimpan");

    console.log(form);
  };

  return (
    <div className="space-y-6 max-w-3xl p-6 relative z-50">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Setting Website
        </h1>

        <p className="text-gray-500">
          Konfigurasi informasi toko
        </p>
      </div>

      {/* CARD */}
      <Card className="relative z-50">

        <CardHeader>
          <CardTitle>
            Informasi Toko
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="space-y-5">

            {/* LOGO */}
            <div>

              <Label>Logo</Label>

              <div className="flex items-center gap-4 mt-3">

                {form.logo && (
                  <img
                    src={form.logo}
                    alt="logo"
                    className="w-24 h-24 rounded-xl border object-cover"
                  />
                )}

                <label className="cursor-pointer">

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleUpload}
                  />

                  <div className="px-4 py-2 border rounded-xl flex items-center gap-2 hover:bg-gray-50 cursor-pointer">

                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}

                    Upload

                  </div>

                </label>

              </div>
            </div>

            {/* NAMA TOKO */}
            <div>

              <Label>Nama Toko</Label>

              <Input
                value={form.nama_toko}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama_toko: e.target.value,
                  })
                }
              />

            </div>

            {/* ALAMAT */}
            <div>

              <Label>Alamat</Label>

              <Textarea
                value={form.alamat_toko}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat_toko: e.target.value,
                  })
                }
              />

            </div>

            {/* WHATSAPP */}
            <div>

              <Label>No WhatsApp</Label>

              <Input
                value={form.no_hp_admin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    no_hp_admin: e.target.value,
                  })
                }
              />

            </div>

            {/* DESKRIPSI */}
            <div>

              <Label>Deskripsi</Label>

              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deskripsi: e.target.value,
                  })
                }
              />

            </div>

          </div>

        </CardContent>
      </Card>

      {/* BUTTON FIX */}
      <div className="fixed bottom-6 right-6 z-[99999]">

        <button
          type="button"
          onClick={handleSave}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl"
        >
          SIMPAN
        </button>

      </div>

    </div>
  );
}