import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import base44 from '@/api/base44Client';

import { useQuery } from '@tanstack/react-query';

import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Home() {

  // =========================
  // STATE SETTING
  // =========================
  const [setting, setSetting] = useState({
    nama_toko: 'Azqia Water',
    alamat_toko: '',
    no_hp_admin: '',
    deskripsi: '',
    logo: '',
  });

  // =========================
  // LOAD LOCAL STORAGE
  // =========================
  useEffect(() => {

    const saved = localStorage.getItem('setting_toko');

    if (saved) {
      setSetting(JSON.parse(saved));
    }

  }, []);

  // =========================
  // AMBIL PRODUK
  // =========================
  const { data: produkList = [] } = useQuery({
    queryKey: ['produk-home'],
    queryFn: () =>
      base44.entities.Produk.filter(
        { aktif: true },
        '-created_date',
        4
      ),
  });

  // =========================
  // FITUR
  // =========================
  const features = [
    {
      icon: ShoppingBag,
      title: 'Galon & Gas Lengkap',
      desc: 'Tersedia isi ulang dan tabung baru',
    },
    {
      icon: Truck,
      title: 'Antar ke Rumah',
      desc: 'Pesan cepat langsung sampai',
    },
    {
      icon: Shield,
      title: 'Harga Terjangkau',
      desc: 'Harga bersahabat untuk semua',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">

          <div className="max-w-2xl mx-auto text-center space-y-6">

            {/* LOGO */}
            {setting.logo && (
              <img
                src={setting.logo}
                alt="logo"
                className="w-36 h-36 rounded-full object-cover border-4 border-pink-500 mx-auto shadow-lg"
              />
            )}

            {/* NAMA TOKO */}
            <h1 className="text-5xl font-extrabold text-gray-900">
              {setting.nama_toko}
            </h1>

            {/* DESKRIPSI */}
            <p className="text-xl text-gray-600">
              {setting.deskripsi}
            </p>

            {/* ALAMAT */}
            {setting.alamat_toko && (
              <p className="text-gray-500">
                📍 {setting.alamat_toko}
              </p>
            )}

            {/* BUTTON */}
            <div className="flex justify-center gap-4 flex-wrap">

              <Link to="/produk">
                <Button
                  size="lg"
                  className="rounded-xl px-8"
                >
                  Lihat Produk
                </Button>
              </Link>

              {setting.no_hp_admin && (
                <a
                  href={`https://wa.me/${setting.no_hp_admin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl"
                  >
                    WhatsApp
                  </Button>
                </a>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* FITUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border p-6 flex gap-4"
            >

              <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center">

                <f.icon className="w-7 h-7 text-pink-500" />

              </div>

              <div>

                <h3 className="font-bold text-lg">
                  {f.title}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {f.desc}
                </p>

              </div>

            </div>
          ))}

        </div>
      </section>

      {/* PRODUK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold">
              Produk Terbaru
            </h2>

            <p className="text-gray-500 mt-1">
              Produk pilihan terbaik untuk anda
            </p>

          </div>

          <Link to="/produk">

            <Button
              variant="outline"
              className="rounded-xl"
            >
              Semua Produk

              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

          </Link>

        </div>

        {/* LIST PRODUK */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {produkList.map((produk) => (

            <Link
              key={produk.id}
              to="/produk"
              className="group"
            >

              <div className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition duration-300">

                {/* GAMBAR */}
                <div className="aspect-square overflow-hidden bg-gray-100">

                  <img
                    src={
                      produk.gambar ||
                      'https://placehold.co/400x400'
                    }
                    alt={produk.nama_produk}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                </div>

                {/* ISI */}
                <div className="p-4">

                  <h3 className="font-bold text-lg line-clamp-1">
                    {produk.nama_produk}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {produk.deskripsi}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-pink-500 font-bold text-lg">
                      Rp {Number(produk.harga || 0).toLocaleString('id-ID')}
                    </span>

                    <Button
                      size="sm"
                      className="rounded-xl"
                    >
                      Lihat
                    </Button>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </div>
  );
}