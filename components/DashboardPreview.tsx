"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  Crosshair,
 Flame,
  Skull,
  Swords,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function DashboardPreview() {

  const [statsData, setStatsData] =
    useState<any[]>([]);

  const [selectedPlayer, setSelectedPlayer] =
    useState("Todos os Players");

  const [stats, setStats] = useState({
    kills: 0,
    damage: 0,
    deaths: 0,
    assists: 0,
    registros: 0,
    kd: "0.0",
    players: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [selectedPlayer, statsData]);

  async function fetchStats() {

    /* IA */

    const { data: matchesData } =
      await supabase
        .from("matches")
        .select("*");

    /* MANUAL */

    const { data: manualPlayers } =
      await supabase
        .from("manual_players")
        .select("*");

    const formattedIA =
      (matchesData || []).map(
        (item: any) => ({
          player_name:
            item.player_name,

          kills:
            item.kills || 0,

          damage:
            item.damage || 0,

          deaths:
            item.deaths || 0,

          assists:
            item.assists || 0,

          source: "IA",
        })
      );

    const formattedManual =
      (manualPlayers || []).map(
        (player: any) => ({
          player_name:
            player.player_name,

          kills:
            player.kills || 0,

          damage:
            player.damage || 0,

          deaths:
            player.deaths || 0,

          assists:
            player.assists || 0,

          source: "Manual",
        })
      );

    setStatsData([
      ...formattedIA,
      ...formattedManual,
    ]);
  }

  function calculateStats() {

    const filteredData =
      selectedPlayer ===
      "Todos os Players"

        ? statsData

        : statsData.filter(
            (item: any) =>
              item.player_name ===
              selectedPlayer
          );

    const kills =
      filteredData.reduce(
        (
          acc: number,
          item: any
        ) =>
          acc +
          (item.kills || 0),

        0
      );

    const damage =
      filteredData.reduce(
        (
          acc: number,
          item: any
        ) =>
          acc +
          (item.damage || 0),

        0
      );

    const deaths =
      filteredData.reduce(
        (
          acc: number,
          item: any
        ) =>
          acc +
          (item.deaths || 0),

        0
      );

    const assists =
      filteredData.reduce(
        (
          acc: number,
          item: any
        ) =>
          acc +
          (item.assists || 0),

        0
      );

    const registros =
      filteredData.length || 0;

    const players =
      new Set(
        filteredData.map(
          (item: any) =>
            item.player_name
        )
      ).size;

    const kd =
      deaths > 0
        ? (
            kills / deaths
          ).toFixed(1)
        : kills.toFixed(1);

    setStats({
      kills,
      damage,
      deaths,
      assists,
      registros,
      kd,
      players,
    });
  }

  const playersList = useMemo(() => {

    return Array.from(
      new Set(
        statsData.map(
          (item: any) =>
            item.player_name
        )
      )
    );

  }, [statsData]);

  return (

    <section className="px-6 pb-24">

      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

          <div>

            <h2 className="text-3xl font-black text-white mb-2">

              Resumo dos Players

            </h2>

            <p className="text-gray-400">

              Estatísticas gerais dos players analisados pela IA e players manuais.

            </p>

          </div>

          {/* SELECT */}

          <div className="min-w-[320px]">

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">

              <p className="text-sm text-gray-400 mb-3 font-bold uppercase">

                Selecionar Player

              </p>

              <select
                value={selectedPlayer}
                onChange={(e) =>
                  setSelectedPlayer(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-[#0B1220]
                  border
                  border-white/10
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-orange-500
                  transition
                "
              >

                <option>

                  Todos os Players

                </option>

                {playersList.map(
                  (player: any) => (

                    <option
                      key={player}
                    >

                      {player}

                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </div>

        {/* CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <StatCard
            icon={<Crosshair />}
            title="Kills Totais"
            value={stats.kills}
            description="Soma total de kills."
          />

          <StatCard
            icon={<Flame />}
            title="Dano Total"
            value={stats.damage}
            description="Dano total causado."
          />

          <StatCard
            icon={<Swords />}
            title="KD Geral"
            value={stats.kd}
            description="Kills divididas pelas mortes."
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <StatCard
            icon={<Skull />}
            title="Mortes Totais"
            value={stats.deaths}
            description="Total de mortes."
          />

          <StatCard
            icon={<Activity />}
            title="Assistências"
            value={stats.assists}
            description="Assistências somadas."
          />

          <StatCard
            icon={<Users />}
            title="Players"
            value={stats.players}
            description={`${stats.registros} registros encontrados.`}
          />

        </div>

      </div>

    </section>

  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: any;
  title: string;
  value: any;
  description: string;
}) {

  return (

    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 hover:border-orange-500/30 transition">

      <div className="flex items-center justify-between mb-5">

        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">

          {icon}

        </div>

        <span className="text-xs text-gray-500 font-bold uppercase">

          Geral

        </span>

      </div>

      <p className="text-gray-400 mb-2">

        {title}

      </p>

      <h3 className="text-5xl font-black text-orange-500 mb-4">

        {value}

      </h3>

      <p className="text-gray-500 text-sm leading-relaxed">

        {description}

      </p>

    </div>

  );
}