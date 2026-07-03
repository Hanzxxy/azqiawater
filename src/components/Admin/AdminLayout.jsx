import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import base44 from "@/api/base44Client";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Store,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/produk", icon: Package, label: "Produk" },
  { to: "/admin/pesanan", icon: ClipboardList, label: "Pesanan" },
  { to: "/admin/pos", icon: ShoppingCart, label: "POS" },
  { to: "/admin/laporan", icon: BarChart3, label: "Laporan" },
  { to: "/admin/setting", icon: Settings, label: "Setting" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // =====================
  // FIX LOGOUT SAFETY
  // =====================
  const handleLogout = () => {
    try {
      base44.auth?.logout?.("/");
    } catch (err) {
      console.log("Logout error:", err);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-5 border-b border-border">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold block">Depot Air & Gas</span>
                <span className="text-xs text-gray-500">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* NAV */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== "/admin" &&
                  location.pathname.startsWith(item.to));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="p-3 border-t border-border">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 mb-1"
            >
              <Store className="w-4 h-4" />
              Lihat Toko
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b px-4 h-14 flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <span className="ml-3 font-semibold">Admin</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}