export default function Hero() {

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-5 py-20 md:px-6 md:py-24 overflow-hidden">

      {/* BG */}

      <div className="absolute w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full top-[-150px]"></div>

      {/* LOGO */}

      <div className="relative z-10 mb-8 md:mb-10">

        <img
          src="/logo.png"
          alt="BooyahStats"
          className="w-32 md:w-56 object-contain mx-auto"
        />

      </div>

      {/* BADGE */}

      <div className="relative z-10 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-orange-400 mb-6 text-xs md:text-base font-semibold backdrop-blur max-w-[90%]">

        Analytics Inteligente para Free Fire

      </div>

      {/* TITLE */}

      <h1 className="relative z-10 text-4xl leading-tight md:text-7xl font-black max-w-5xl">

        Evolua suas partidas com

        <span className="block text-orange-500 mt-2">
          IA profissional
        </span>

      </h1>

      {/* DESCRIPTION */}

      <p className="relative z-10 text-gray-400 text-base md:text-xl max-w-2xl mt-6 leading-relaxed">

        Analise kills, dano, headshots e desempenho do squad automaticamente.

      </p>

      {/* BUTTONS */}

      <div className="relative z-10 flex flex-col md:flex-row gap-4 mt-10 w-full md:w-auto">

        <button className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 px-8 py-4 rounded-2xl text-base md:text-lg font-black w-full md:w-auto">

          ANALISAR PARTIDA

        </button>

        <button className="border border-white/10 hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300 px-8 py-4 rounded-2xl text-base md:text-lg font-black w-full md:w-auto">

          VER DASHBOARD

        </button>

      </div>

    </section>
  );
}