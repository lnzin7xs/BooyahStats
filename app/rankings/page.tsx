"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RankingsPage() {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    fetchRankings();
  }, []);

  async function fetchRankings() {
    const { data: matchesData } = await supabase.from("matches").select("*");
    const { data: manualData } = await supabase.from("manual_players").select("*");

    const grouped: any = {};

    (matchesData || []).forEach((match: any) => {
      const name = match.player_name;

      if (!grouped[name]) {
        grouped[name] = {
          name,
          kills: 0,
          damage: 0,
          deaths: 0,
          assists: 0,
          matches: 0,
        };
      }

      grouped[name].kills += match.kills || 0;
      grouped[name].damage += match.damage || 0;
      grouped[name].deaths += match.deaths || 0;
      grouped[name].assists += match.assists || 0;
      grouped[name].matches += 1;
    });

    (manualData || []).forEach((player: any) => {
      grouped[player.player_name] = {
        name: player.player_name,
        kills: player.kills || 0,
        damage: player.damage || 0,
        deaths: player.deaths || 0,
        assists: player.assists || 0,
        matches: player.matches || 0,
      };
    });

    setPlayers(Object.values(grouped));
  }

  const topKills = [...players].sort((a, b) => b.kills - a.kills);
  const topDamage = [...players].sort((a, b) => b.damage - a.damage);
  const topKD = [...players].sort((a, b) => {
    const kdA = a.deaths > 0 ? a.kills / a.deaths : a.kills;
    const kdB = b.deaths > 0 ? b.kills / b.deaths : b.kills;
    return kdB - kdA;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white p-6 lg:pl-24 pt-20 lg:pt-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-black text-orange-500 mb-2">
            Rankings
          </h1>
          <p className="text-gray-400">
            Ranking competitivo dos players cadastrados e analisados.
          </p>
        </div>

        <a
          href="/"
          className="flex items-center gap-3 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 transition px-5 py-3 rounded-2xl"
        >
          <ArrowLeft size={24} className="text-orange-500" />
          <span className="font-bold">Voltar</span>
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <RankingCard title="Top Kills" players={topKills} field="kills" />
        <RankingCard title="Top Dano" players={topDamage} field="damage" />
        <RankingCard title="Top KD" players={topKD} field="kd" />
      </div>
    </main>
  );
}

function RankingCard({ title, players, field }: any) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <Trophy className="text-orange-500" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div>
        {players.slice(0, 10).map((player: any, index: number) => {
          const kd =
            player.deaths > 0
              ? (player.kills / player.deaths).toFixed(1)
              : player.kills;

          const value = field === "kd" ? kd : player[field];

          return (
            <div
              key={player.name}
              className="flex items-center justify-between p-5 border-b border-white/10 last:border-none hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-orange-500 font-black text-xl">
                  #{index + 1}
                </span>

                <div>
                  <h3 className="font-bold text-white">{player.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {player.matches} registros
                  </p>
                </div>
              </div>

              <span className="text-orange-500 font-black text-2xl">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}