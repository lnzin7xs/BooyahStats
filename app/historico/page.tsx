"use client";

import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function HistoricoPage() {

  const [matches, setMatches] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchMatches();

  }, []);

  async function fetchMatches() {

    setLoading(true);

    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {

      console.error(error);

    } else {

      setMatches(data || []);

    }

    setLoading(false);
  }

  function formatMode(mode: string) {

    if (mode === "BATTLE_ROYALE") {
      return "Battle Royale";
    }

    if (mode === "CONTRA_SQUAD") {
      return "Contra Squad";
    }

    return mode;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white p-6 md:pl-32">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-5xl font-black text-orange-500 mb-2">

            Histórico

          </h1>

          <p className="text-gray-400">

            Todas as análises realizadas pela IA.

          </p>

        </div>

        <a
          href="/"
          className="flex items-center gap-3 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 transition px-5 py-3 rounded-2xl"
        >

          <ArrowLeft
            size={24}
            className="text-orange-500"
          />

          <span className="font-bold">

            Voltar

          </span>

        </a>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <p className="text-gray-400 mb-2">

            Jogadores Analisados

          </p>

          <h2 className="text-4xl font-black text-orange-500">

            {matches.length}

          </h2>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <p className="text-gray-400 mb-2">

            Total de Kills

          </p>

          <h2 className="text-4xl font-black text-orange-500">

            {matches.reduce((acc, item) => acc + (item.kills || 0), 0)}

          </h2>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <p className="text-gray-400 mb-2">

            Total de Dano

          </p>

          <h2 className="text-4xl font-black text-orange-500">

            {matches.reduce((acc, item) => acc + (item.damage || 0), 0)}

          </h2>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <p className="text-gray-400 mb-2">

            Players Únicos

          </p>

          <h2 className="text-4xl font-black text-orange-500">

            {new Set(matches.map((m) => m.player_name)).size}

          </h2>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

        <div className="p-6 border-b border-white/10">

          <h2 className="text-2xl font-bold">

            Histórico de Partidas

          </h2>

        </div>

        {loading ? (

          <div className="p-10 text-center text-gray-400">

            Carregando histórico...

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-white/5 text-gray-400">

                <tr>

                  <th className="p-4">Player</th>

                  <th className="p-4">Modo</th>

                  <th className="p-4">Kills</th>

                  <th className="p-4">Mortes</th>

                  <th className="p-4">Assistências</th>

                  <th className="p-4">Dano</th>

                  <th className="p-4">Equipe</th>

                  <th className="p-4">Data</th>

                </tr>

              </thead>

              <tbody>

                {matches.map((match, index) => (

                  <tr
                    key={index}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >

                    <td className="p-4 font-bold text-white">

                      {match.player_name}

                    </td>

                    <td className="p-4 font-bold text-orange-400">

                      {formatMode(match.mode)}

                    </td>

                    <td className="p-4 text-orange-500 font-bold">

                      {match.kills}

                    </td>

                    <td className="p-4">

                      {match.deaths}

                    </td>

                    <td className="p-4">

                      {match.assists}

                    </td>

                    <td className="p-4">

                      {match.damage}

                    </td>

                    <td className="p-4">

                      {match.team}

                    </td>

                    <td className="p-4 text-gray-400">

                      {new Date(match.created_at).toLocaleDateString("pt-BR")}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}