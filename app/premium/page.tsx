"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

import {
  ArrowLeft,
  Check,
  Crown,
  Gem,
  ShieldCheck,
  Sparkles,
  Zap,
  X,
} from "lucide-react";

export default function PremiumPage() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showVipInstructions, setShowVipInstructions] = useState(false);

  const discordLink = "https://discord.gg/8ttJxGzSj";
  const pixKey = "ecca0368-df5e-4c92-8f10-ddd5f0a98eee";
  const pixCode = generatePixCode({
    key: pixKey,
    merchantName: "Luan Felipe Nicolau Pereira",
    merchantCity: "Nepomuceno",
    amount: "4.99",
    txid: "BOOYAHVIP",
  });

  function copyPixCode() {
    navigator.clipboard.writeText(pixCode);
    alert("Código Pix copiado!");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white p-4 md:p-6 lg:pl-24 pt-20 lg:pt-6 overflow-x-hidden">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Gem size={26} className="text-orange-500" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-black text-orange-500 leading-none">
              Premium
            </h1>

            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Escolha o plano ideal para evoluir suas análises.
            </p>
          </div>
        </div>

        <a
          href="/"
          className="w-fit flex items-center gap-3 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 transition px-5 py-3 rounded-2xl"
        >
          <ArrowLeft size={22} className="text-orange-500" />

          <span className="font-bold">Voltar</span>
        </a>
      </div>

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-[#111827] to-black border border-orange-500/20 rounded-[35px] p-6 md:p-10 mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-2 rounded-full font-bold mb-6 text-sm">
            <Sparkles size={16} />
            BOOYAHSTATS VIP
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight max-w-5xl mb-6">
            Mais análises, mais controle e{" "}
            <span className="text-orange-500">mais evolução</span>
          </h2>

          <p className="text-base md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-10">
            O plano Free é ideal para testar a plataforma. O VIP libera o uso
            completo para players, squads, criadores de conteúdo e equipes que
            querem acompanhar desempenho de verdade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowVipInstructions(true)}
              className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-2xl font-black text-lg md:text-xl shadow-lg shadow-orange-500/20"
            >
              TORNAR-SE VIP
            </button>

            <button
              onClick={() => setShowFeatures(true)}
              className="border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 transition px-8 py-4 rounded-2xl font-black text-lg md:text-xl text-center"
            >
              VER RECURSOS
            </button>
          </div>
        </div>
      </section>

      {/* MODAL */}

      {showFeatures && (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/70 backdrop-blur-sm p-4 md:p-6">
          <div className="relative w-full max-w-7xl mx-auto bg-gradient-to-b from-[#111827] to-black border border-orange-500/20 rounded-[35px] p-6 md:p-10">
            {/* FECHAR */}

            <button
              onClick={() => setShowFeatures(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-2xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition flex items-center justify-center"
            >
              <X size={22} className="text-white" />
            </button>

            <div className="mb-10 pr-10">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-2 rounded-full font-bold mb-5 text-sm">
                <Sparkles size={16} />
                RECURSOS VIP
              </div>

              <h2 className="text-3xl md:text-5xl font-black mb-5 leading-tight">
                Tudo que você desbloqueia{" "}
                <span className="text-orange-500">no VIP</span>
              </h2>

              <p className="text-gray-400 text-base md:text-xl max-w-4xl leading-relaxed">
                O plano VIP libera todos os recursos competitivos da plataforma,
                permitindo análises ilimitadas, comparações avançadas e gestão
                completa de squads profissionais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <VipFeatureCard
                title="IA ilimitada"
                description="Analise partidas sem limite diário."
              />

              <VipFeatureCard
                title="Comparação de jogadores"
                description="Compare player contra player."
              />

              <VipFeatureCard
                title="Comparação de equipes"
                description="Descubra qual squad está melhor."
              />

              <VipFeatureCard
                title="Múltiplas equipes"
                description="Crie vários squads."
              />

              <VipFeatureCard
                title="Dashboard avançado"
                description="Gráficos e estatísticas competitivas."
              />

              <VipFeatureCard
                title="Histórico ilimitado"
                description="Salve análises sem limite."
              />

              <VipFeatureCard
                title="Rankings avançados"
                description="Acompanhe rankings completos."
              />

              <VipFeatureCard
                title="Estatísticas profissionais"
                description="KD, dano, assists e muito mais."
              />

              <VipFeatureCard
                title="Novidades antecipadas"
                description="Receba futuras features primeiro."
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIP */}

      {showVipInstructions && (
        <div
          onClick={() => setShowVipInstructions(false)}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm p-4 md:p-6 flex items-start md:items-center justify-center overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl my-6 md:my-0 max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#111827] to-black border border-orange-500/20 rounded-[35px] p-6 md:p-8"
          >
            <button
              onClick={() => setShowVipInstructions(false)}
              className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition flex items-center justify-center"
            >
              <X size={22} className="text-white" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
              <Crown size={32} className="text-orange-500" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Como adquirir o VIP
            </h2>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
              Para adquirir o VIP, escaneie o QR Code Pix ou copie o código Pix,
              realize o pagamento de R$ 4,99 e depois entre no Discord oficial
              do BooyahStats para enviar o comprovante junto com o email
              cadastrado no site.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6">
              <p className="text-orange-500 font-black text-2xl mb-5">
                R$ 4,99 / mês
              </p>

              <div className="flex justify-center mb-5">
                <div className="bg-white p-4 rounded-3xl">
                  <QRCode value={pixCode} size={210} />
                </div>
              </div>

              <p className="text-gray-300 font-bold mb-2">Código Pix:</p>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 break-all text-xs text-gray-300 max-h-28 overflow-y-auto">
                {pixCode}
              </div>

              <button
                onClick={copyPixCode}
                className="mt-4 w-full bg-white/10 hover:bg-white/20 transition py-3 rounded-2xl font-black"
              >
                COPIAR CÓDIGO PIX
              </button>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 mb-6">
              <h3 className="text-xl font-black text-orange-500 mb-3">
                Após o pagamento
              </h3>

              <ul className="space-y-2 text-gray-300 text-sm md:text-base">
                <li>1. Entre no Discord oficial.</li>
                <li>2. Abra um ticket ou chame o suporte.</li>
                <li>3. Envie o comprovante do Pix.</li>
                <li>4. Envie o email cadastrado no BooyahStats.</li>
              </ul>
            </div>

            <a
              href={discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-500/20"
            >
              ENTRAR NO DISCORD
            </a>
          </div>
        </div>
      )}

      {/* PLANOS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <PlanCard
          type="free"
          icon={<ShieldCheck size={26} className="text-white" />}
          title="FREE"
          subtitle="Plano gratuito com limitações."
          button="PLANO ATUAL"
          features={[
            "5 análises por IA por dia",
            "1 equipe criada",
            "Dashboard básico",
            "Rankings básicos",
          ]}
          unavailable={[
            "Comparação jogador x jogador",
            "Comparação equipe x equipe",
            "IA ilimitada",
            "Dashboard competitivo",
          ]}
        />

        <PlanCard
          type="vip"
          icon={<Crown size={26} className="text-orange-500" />}
          title="VIP"
          subtitle="Recursos completos sem limites."
          button="TORNAR-SE VIP"
          onButtonClick={() => setShowVipInstructions(true)}
          features={[
            "IA ilimitada",
            "Comparação jogador x jogador",
            "Comparação equipe x equipe",
            "Múltiplas equipes",
            "Dashboard avançado",
            "Histórico ilimitado",
            "Métricas profissionais",
          ]}
          unavailable={[]}
        />
      </div>

      {/* FOOTER */}

      <section className="mt-12 bg-white/5 border border-white/10 rounded-[35px] p-6 md:p-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap size={22} className="text-orange-500" />

              <h3 className="text-2xl md:text-3xl font-black">
                Limites do Free, poder do VIP
              </h3>
            </div>

            <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed">
              O Free possui limite diário de análises. No VIP, todos os recursos
              competitivos são desbloqueados.
            </p>
          </div>

          <button
            onClick={() => setShowVipInstructions(true)}
            className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            ADQUIRIR VIP - R$ 4,99
          </button>
        </div>
      </section>
    </main>
  );
}

function removeAccents(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toUpperCase();
}

function emv(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function crc16(payload: string) {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function generatePixCode({
  key,
  merchantName,
  merchantCity,
  amount,
  txid,
}: {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: string;
  txid: string;
}) {
  const gui = emv("00", "br.gov.bcb.pix");
  const pixKeyField = emv("01", key);
  const merchantAccountInfo = emv("26", gui + pixKeyField);
  const additionalData = emv("62", emv("05", removeAccents(txid).slice(0, 25)));

  const payloadSemCRC =
    emv("00", "01") +
    merchantAccountInfo +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", amount) +
    emv("58", "BR") +
    emv("59", removeAccents(merchantName).slice(0, 25)) +
    emv("60", removeAccents(merchantCity).slice(0, 15)) +
    additionalData +
    "6304";

  return payloadSemCRC + crc16(payloadSemCRC);
}

function PlanCard({
  type,
  icon,
  title,
  subtitle,
  features,
  unavailable,
  button,
  onButtonClick,
}: any) {
  const isVip = type === "vip";

  return (
    <div
      className={`relative overflow-hidden rounded-[35px] p-6 md:p-8 border ${
        isVip
          ? "bg-gradient-to-br from-orange-500/15 via-[#111827] to-black border-orange-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      {isVip && (
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 blur-[120px]" />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${
              isVip ? "bg-orange-500/10" : "bg-white/10"
            }`}
          >
            {icon}
          </div>

          <div>
            <h3
              className={`text-3xl font-black ${
                isVip ? "text-orange-500" : "text-white"
              }`}
            >
              {title}
            </h3>

            <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          {features.map((item: string) => (
            <Feature key={item} text={item} vip={isVip} />
          ))}

          {unavailable.map((item: string) => (
            <Unavailable key={item} text={item} />
          ))}
        </div>

        <button
          onClick={onButtonClick}
          className={`w-full mt-10 transition py-4 rounded-2xl font-black text-lg ${
            isVip
              ? "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {button}
        </button>
      </div>
    </div>
  );
}

function Feature({ text, vip }: { text: string; vip?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          vip ? "bg-orange-500/10" : "bg-white/10"
        }`}
      >
        <Check size={18} className={vip ? "text-orange-500" : "text-white"} />
      </div>

      <span
        className={`text-sm md:text-base ${
          vip ? "text-white font-semibold" : "text-gray-300"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

function Unavailable({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 opacity-70">
      <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
        <X size={18} className="text-red-400" />
      </div>

      <span className="text-sm md:text-base text-gray-500 line-through">
        {text}
      </span>
    </div>
  );
}

function VipFeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 hover:border-orange-500/30 hover:bg-orange-500/5 transition">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5">
        <Crown size={22} className="text-orange-500" />
      </div>

      <h3 className="text-2xl font-black mb-3">{title}</h3>

      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
