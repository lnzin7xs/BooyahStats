"use client";

import { useState } from "react";

import {
  House,
  BarChart3,
  LineChart,
  Users,
  Trophy,
  Gem,
  Settings,
  Menu,
  X,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: House, label: "Home", href: "/" },
    { icon: BarChart3, label: "Histórico", href: "/historico" },
    { icon: Shield, label: "Equipe", href: "/equipe" },
    { icon: LineChart, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Players", href: "/players" },
    { icon: Trophy, label: "Rankings", href: "/rankings" },
    { icon: Gem, label: "Premium", href: "/premium" },
  ];

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#070B14] border-b border-white/10 z-50 flex items-center justify-between px-5">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <X size={28} className="text-orange-500" />
          ) : (
            <Menu size={28} className="text-orange-500" />
          )}
        </button>

        <img
          src="/logo.png"
          alt="BooyahStats"
          className="w-10 h-10 object-contain"
        />
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-[#070B14] border-b border-white/10 z-40 p-4">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-500/10 transition"
                >
                  <Icon size={22} className="text-orange-500" />

                  <span className="text-white font-bold text-sm">
                    {item.label}
                  </span>
                </a>
              );
            })}

            <a
              href="/configuracoes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-500/10 transition"
            >
              <Settings size={22} className="text-orange-500" />

              <span className="text-white font-bold text-sm">
                Configurações
              </span>
            </a>
          </nav>
        </div>
      )}

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-16 hover:w-52 bg-[#070B14] border-r border-white/5 flex-col z-50 transition-all duration-300 group overflow-hidden">
        <div className="h-20 flex items-center justify-center border-b border-white/5">
          <img
            src="/logo.png"
            alt="BooyahStats"
            className="w-10 h-10 object-contain"
          />
        </div>

        <nav className="flex flex-col gap-3 mt-5 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 h-12 px-3 rounded-xl text-orange-500 hover:bg-orange-500/10 transition"
              >
                <Icon size={24} strokeWidth={2.2} className="min-w-6" />

                <span className="opacity-0 group-hover:opacity-100 transition whitespace-nowrap text-white font-bold text-sm">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto mb-5 px-2">
          <a
            href="/configuracoes"
            className="flex items-center gap-3 h-12 px-3 rounded-xl text-orange-500 hover:bg-orange-500/10 transition"
          >
            <Settings size={24} strokeWidth={2.2} className="min-w-6" />

            <span className="opacity-0 group-hover:opacity-100 transition whitespace-nowrap text-white font-bold text-sm">
              Configurações
            </span>
          </a>
        </div>
      </aside>
    </>
  );
}