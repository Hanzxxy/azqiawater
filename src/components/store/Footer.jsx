import React from 'react';
import { Store, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Store className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Depot Air & Gas Azkiaa Water</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
              Melayani isi ulang galon dan gas LPG dengan harga terjangkau dan pengiriman cepat.
              </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Kontak</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jl. H. Nidi, Kp. Baru, RT. 004/002, Serua, Kec. Bojongsari, Kota Depok, Jawa Barat 16516</span>
                </div>
                <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+62 812-9841-5782</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Toko Depot Iir Isi Ulang & Gas LPG.</p>
        </div>
      </div>
    </footer>
  );
}