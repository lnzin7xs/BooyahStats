"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [manualName, setManualName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    setLoading(true);

    const { data: matchesData } = await supabase.from("matches").select("*");

    const { data: manualData } = await supabase
      .from("manual_players")
      .select("*")
      .order("created_at", { ascending: false });

    const groupedPlayers: any = {};

    (matchesData || []).forEach((match: any) => {
      const name = match.player_name;

      if (!groupedPlayers[name]) {
        groupedPlayers[name] = {
          name,
          kills: 0,
          damage: 0,
          deaths: 0,
          assists: 0,
          matches: 0,
          source: "IA",
        };
      }

      groupedPlayers[name].kills += match.kills || 0;
      groupedPlayers[name].damage += match.damage || 0;
      groupedPlayers[name].deaths += match.deaths || 0;
      groupedPlayers[name].assists += match.assists || 0;
      groupedPlayers[name].matches += 1;
    });

    (manualData || []).forEach((player: any) => {
      groupedPlayers[player.player_name] = {
        id: player.id,
        name: player.player_name,
        kills: player.kills || 0,
        damage: player.damage || 0,
        deaths: player.deaths || 0,
        assists: player.assists || 0,
        matches: player.matches || 0,
        source: "Manual",
      };
    });

    const finalPlayers = (Object.values(groupedPlayers) as any[]).sort(
      (a: any, b: any) => b.kills - a.kills
    );

    setPlayers(finalPlayers);
    setLoading(false);
  }

  async function addManualPlayer() {
    if (!manualName.trim()) return;

    const { error } = await supabase.from("manual_players").insert([
      {
        player_name: manualName.trim(),
        kills: 0,
        deaths: 0,
        assists: 0,
        damage: 0,
        matches: 0,
      },
    ]);

    if (error) {
      alert("Erro ao adicionar player: " + error.message);
      return;
    }

    setManualName("");
    await fetchPlayers();
  }

  function updateLocalPlayer(name: string, field: string, value: string) {
    setPlayers((current) =>
      current.map((player) =>
        player.name === name ? { ...player, [field]: value } : player
      )
    );
  }

  async function saveManualPlayer(player: any) {
    const { error } = await supabase
      .from("manual_players")
      .update({
        kills: Number(player.kills) || 0,
        deaths: Number(player.deaths) || 0,
        assists: Number(player.assists) || 0,
        damage: Number(player.damage) || 0,
        matches: Number(player.matches) || 0,
      })
      .eq("id", player.id);

    if (error) {
      alert("Erro ao salvar player: " + error.message);
      return;
    }

    await fetchPlayers();
  }

  async function deleteManualPlayer(id: string) {
    const confirmDelete = confirm("Remover player manual?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("manual_players").delete().eq("id", id);

    if (error) {
      alert("Erro ao remover player: " + error.message);
      return;
    }

    await fetchPlayers();
  }

  async function deleteIAPlayer(playerName: string) {
    const confirmDelete = confirm(
      `Remover todas as análises do player ${playerName}?`
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("matches")
      .delete()
      .eq("player_name", playerName);

    if (error) {
      alert("Erro ao remover player da IA: " + error.message);
      return;
    }

    await fetchPlayers();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white p-6 lg:pl-32 pt-20 lg:pt-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-black text-orange-500 mb-2">
            Players
          </h1>

          <p className="text-gray-400">
            Gerencie players manuais e acompanhe estatísticas da IA.
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

      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Adicionar Player</h2>

        <div className="flex gap-3">
          <input
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            placeholder="Nome do player"
            className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-orange-500"
          />

          <button
            onClick={addManualPlayer}
            className="bg-orange-500 hover:bg-orange-600 transition rounded-2xl px-5"
          >
            <Plus />
          </button>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Estatísticas dos Players</h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">
            Carregando players...
          </div>
        ) : players.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            Nenhum player encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-5">#</th>
                  <th className="p-5">Player</th>
                  <th className="p-5">Origem</th>
                  <th className="p-5">Kills</th>
                  <th className="p-5">Dano</th>
                  <th className="p-5">Mortes</th>
                  <th className="p-5">Assist.</th>
                  <th className="p-5">Registros</th>
                  <th className="p-5 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {players.map((player, index) => (
                  <tr
                    key={player.name}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-5 text-orange-500 font-black">
                      #{index + 1}
                    </td>

                    <td className="p-5 font-bold text-white">{player.name}</td>

                    <td className="p-5 text-orange-400 font-bold">
                      {player.source}
                    </td>

                    {["kills", "damage", "deaths", "assists", "matches"].map(
                      (field) => (
                        <td key={field} className="p-5">
                          {player.source === "Manual" ? (
                            <NumberInput
                              value={player[field]}
                              onChange={(value) =>
                                updateLocalPlayer(player.name, field, value)
                              }
                            />
                          ) : (
                            player[field]
                          )}
                        </td>
                      )
                    )}

                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-4">
                        {player.source === "Manual" && (
                          <button
                            onClick={() => saveManualPlayer(player)}
                            className="text-orange-500 hover:text-green-400 transition"
                          >
                            <Save size={22} />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            player.source === "Manual"
                              ? deleteManualPlayer(player.id)
                              : deleteIAPlayer(player.name)
                          }
                          className="text-orange-500 hover:text-red-500 transition"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="number"
      value={value || 0}
      onChange={(e) => onChange(e.target.value)}
      className="w-20 bg-[#111827] border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-orange-500 text-white"
    />
  );
}