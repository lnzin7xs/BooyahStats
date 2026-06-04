import Navbar from "@/components/Navbar";
import UploadSection from "@/components/UploadSection";
import DashboardPreview from "@/components/DashboardPreview";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white lg:pl-24">
        {/* HERO */}

        <section className="px-6 pt-28 pb-20 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-center">
              <img
                src="/logo.png"
                alt="BooyahStats"
                className="w-44 h-44 object-contain"
              />
            </div>

            <div className="inline-block mb-8 px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 font-bold">
              Plataforma de Analytics Inteligente para Free Fire
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Evolua suas partidas com{" "}
              <span className="text-orange-500">
                IA profissional
              </span>
            </h1>

            <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-12">
              Analise kills, dano, headshots e desempenho do squad automaticamente.
            </p>

            {/* BOTÕES */}

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a
                href="#upload"
                className="
                  bg-orange-500
                  hover:bg-orange-600
                  transition
                  px-10
                  py-5
                  rounded-2xl
                  font-black
                  text-xl
                  shadow-lg
                  shadow-orange-500/20
                  text-center
                "
              >
                ANALISAR PARTIDA
              </a>

              <a
                href="/dashboard"
                className="
                  border
                  border-white/10
                  hover:border-orange-500/30
                  hover:bg-orange-500/10
                  transition
                  px-10
                  py-5
                  rounded-2xl
                  font-black
                  text-xl
                  text-center
                "
              >
                VER DASHBOARD
              </a>
            </div>
          </div>
        </section>

        {/* UPLOAD */}

        <div id="upload">
          <UploadSection />
        </div>

        {/* DASHBOARD PREVIEW */}

        <DashboardPreview />
      </main>
    </>
  );
}