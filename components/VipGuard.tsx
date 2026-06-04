"use client";

import { useState } from "react";
import { Crown, Gem, X } from "lucide-react";

export default function VipGuard({
  children,
  isVip = false,
}: {
  children: React.ReactNode;
  isVip?: boolean;
}) {
  const [showPopup, setShowPopup] = useState(false);

  if (isVip) return <>{children}</>;

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPopup(true);
        }}
        className="relative cursor-pointer"
      >
        <div className="absolute -top-3 -right-3 z-20 w-10 h-10 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 border-2 border-[#0B0F1A] flex items-center justify-center">
          <Gem size={20} className="text-white" />
        </div>

        {children}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="relative w-full max-w-[520px] bg-gradient-to-b from-[#151A25] via-[#080B12] to-black border border-orange-500/40 rounded-[36px] p-8 text-center shadow-2xl shadow-orange-500/10 overflow-hidden">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPopup(false);
              }}
              className="absolute top-5 right-5 z-30 w-11 h-11 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition flex items-center justify-center"
            >
              <X size={24} className="text-white" />
            </button>

            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto rounded-[26px] bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-7">
                <Crown size={42} className="text-orange-500" />
              </div>

              <h2 className="text-4xl font-black mb-5">Recurso VIP</h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-7">
                Esse recurso é exclusivo para usuários VIP.
              </p>

              <p className="text-gray-400 text-lg leading-relaxed mb-9 max-w-md mx-auto">
                Libere: IA ilimitada, comparação entre jogadores, múltiplas
                equipes, dashboard competitivo e recursos profissionais
                avançados.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-9">
                <VipMiniFeature text="IA ilimitada" />
                <VipMiniFeature text="Comparar jogadores" />
                <VipMiniFeature text="Comparar equipes" />
                <VipMiniFeature text="Dashboard avançado" />
                <VipMiniFeature text="Múltiplas equipes" />
                <VipMiniFeature text="Métricas pro" />
              </div>

              <a
                href="/premium"
                onClick={(e) => e.stopPropagation()}
                className="block w-full bg-orange-500 hover:bg-orange-600 transition py-5 rounded-2xl font-black text-xl shadow-lg shadow-orange-500/30"
              >
                VIRAR VIP
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function VipMiniFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
      <Gem size={16} className="text-orange-500 shrink-0" />

      <span className="text-white font-bold text-sm text-left">
        {text}
      </span>
    </div>
  );
}