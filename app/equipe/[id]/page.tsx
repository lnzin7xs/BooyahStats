"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  UserPlus,
  Check,
  Trash2,
  Crown,
  Gem,
  X,
  Users,
  Shield,
  Star,
  Save,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const USER_IS_VIP = false;

export default function EquipeDetalhesPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<any>(null);
  const [teamPlayers, setTeamPlayers] = useState<any[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [addingPlayer, setAddingPlayer] = useState("");

  const [showVipPopup, setShowVipPopup] = useState(false);

  const [analyst, setAnalyst] = useState("");
  const [coach, setCoach] = useState("");
  const [captain, setCaptain] = useState("");
  const [roles, setRoles] = useState<any>({});
  const [lineup, setLineup] = useState<any>({});

  const totalKills = playerStats.reduce(
    (acc: number, player: any) => acc + (Number(player.kills) || 0),
    0
  );

  const totalDamage = playerStats.reduce(
    (acc: number, player: any) => acc + (Number(player.damage) || 0),
    0
  );

  const totalDeaths = playerStats.reduce(
    (acc: number, player: any) => acc + (Number(player.deaths) || 0),
    0
  );

  const totalAssists = playerStats.reduce(
    (acc: number, player: any) => acc + (Number(player.assists) || 0),
    0
  );

  const totalMatches = playerStats.reduce(
    (acc: number, player: any) => acc + (Number(player.matches) || 0),
    0
  );

  const teamKD =
    totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills;

  const avgDamage =
    totalMatches > 0 ? Math.round(totalDamage / totalMatches) : 0;

  useEffect(() => {
    if (teamId) {
      fetchData();
      loadSquadConfig();
    }
  }, [teamId]);

  function loadSquadConfig() {
    const savedAnalyst = localStorage.getItem(`team_${teamId}_analyst`);
    const savedCoach = localStorage.getItem(`team_${teamId}_coach`);
    const savedCaptain = localStorage.getItem(`team_${teamId}_captain`);
    const savedRoles = localStorage.getItem(`team_${teamId}_roles`);
    const savedLineup = localStorage.getItem(`team_${teamId}_lineup`);

    if (savedAnalyst) setAnalyst(savedAnalyst);
    if (savedCoach) setCoach(savedCoach);
    if (savedCaptain) setCaptain(savedCaptain);
    if (savedRoles) setRoles(JSON.parse(savedRoles));
    if (savedLineup) setLineup(JSON.parse(savedLineup));
  }

  function saveSquadConfig() {
    localStorage.setItem(`team_${teamId}_analyst`, analyst);
    localStorage.setItem(`team_${teamId}_coach`, coach);
    localStorage.setItem(`team_${teamId}_captain`, captain);
    localStorage.setItem(`team_${teamId}_roles`, JSON.stringify(roles));
    localStorage.setItem(`team_${teamId}_lineup`, JSON.stringify(lineup));

    alert("Gestão do squad salva com sucesso.");
  }

  async function fetchData() {
    setLoading(true);

    const { data: teamData } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    const { data: teamPlayersData } = await supabase
      .from("team_players")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });

    const { data: matchesData } = await supabase.from("matches").select("*");

    const { data: manualPlayersData } = await supabase
      .from("manual_players")
      .select("*")
      .order("created_at", { ascending: false });

    const iaPlayersGrouped: any = {};

    (matchesData || []).forEach((match: any) => {
      const name = match.player_name;

      if (!iaPlayersGrouped[name]) {
        iaPlayersGrouped[name] = {
          name,
          source: "IA",
          kills: 0,
          deaths: 0,
          assists: 0,
          damage: 0,
          matches: 0,
        };
      }

      iaPlayersGrouped[name].kills += match.kills || 0;
      iaPlayersGrouped[name].deaths += match.deaths || 0;
      iaPlayersGrouped[name].assists += match.assists || 0;
      iaPlayersGrouped[name].damage += match.damage || 0;
      iaPlayersGrouped[name].matches += 1;
    });

    const iaPlayers = Object.values(iaPlayersGrouped) as any[];

    const manualPlayers = (manualPlayersData || []).map((player: any) => ({
      id: player.id,
      name: player.player_name,
      source: "Manual",
      kills: player.kills || 0,
      deaths: player.deaths || 0,
      assists: player.assists || 0,
      damage: player.damage || 0,
      matches: player.matches || 0,
    }));

    const allAvailablePlayers = [...iaPlayers, ...manualPlayers].sort(
      (a: any, b: any) => b.kills - a.kills
    );

    const teamStatsGrouped: any = {};

    (teamPlayersData || []).forEach((teamPlayer: any) => {
      const foundPlayer = allAvailablePlayers.find(
        (player: any) =>
          player.name?.toLowerCase() === teamPlayer.player_name?.toLowerCase()
      );

      if (foundPlayer) {
        teamStatsGrouped[teamPlayer.player_name] = {
          id: teamPlayer.id,
          name: teamPlayer.player_name,
          source: teamPlayer.source === "ia" ? "IA" : "Manual",
          kills: foundPlayer.kills || 0,
          deaths: foundPlayer.deaths || 0,
          assists: foundPlayer.assists || 0,
          damage: foundPlayer.damage || 0,
          matches: foundPlayer.matches || 0,
        };
      }
    });

    setTeam(teamData);
    setTeamPlayers(teamPlayersData || []);
    setAvailablePlayers(allAvailablePlayers);

    setPlayerStats(
      (Object.values(teamStatsGrouped) as any[]).sort(
        (a: any, b: any) => b.kills - a.kills
      )
    );

    setLoading(false);
  }

  async function addPlayerToTeam(player: any) {
    const alreadyAdded = teamPlayers.some(
      (teamPlayer: any) =>
        teamPlayer.player_name?.toLowerCase() === player.name?.toLowerCase()
    );

    if (alreadyAdded) return;

    setAddingPlayer(player.name);

    const { error } = await supabase.from("team_players").insert([
      {
        team_id: teamId,
        player_name: player.name,
        source: player.source === "IA" ? "ia" : "manual",
      },
    ]);

    if (error) {
      alert("Erro ao adicionar player: " + error.message);
      setAddingPlayer("");
      return;
    }

    await fetchData();

    setTimeout(() => {
      setAddingPlayer("");
    }, 700);
  }

  async function removePlayer(id: string) {
    const confirmDelete = confirm("Remover player da equipe?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("team_players").delete().eq("id", id);

    if (error) {
      alert("Erro ao remover player: " + error.message);
      return;
    }

    await fetchData();
  }

  function updateRole(playerName: string, value: string) {
    setRoles((prev: any) => ({
      ...prev,
      [playerName]: value,
    }));
  }

  function updateLineup(playerName: string, value: string) {
    setLineup((prev: any) => ({
      ...prev,
      [playerName]: value,
    }));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F1A] text-white p-6 lg:pl-32 pt-20">
        Carregando equipe...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white p-6 lg:pl-32 pt-20 lg:pt-6">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          {team?.logo_url ? (
            <img
              src={team.logo_url}
              alt={team.name}
              className="w-24 h-24 rounded-3xl object-cover border border-white/10"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-4xl">
              {team?.name?.[0]}
            </div>
          )}

          <div>
            <h1 className="text-5xl font-black text-orange-500">
              {team?.name}
            </h1>

            <p className="text-gray-400">
              Gerencie players, estatísticas e estrutura competitiva do squad.
            </p>
          </div>
        </div>

        <a
          href="/equipe"
          className="flex items-center gap-3 bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 transition px-5 py-3 rounded-2xl"
        >
          <ArrowLeft size={24} className="text-orange-500" />
          <span className="font-bold">Voltar</span>
        </a>
      </div>

      <section className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Kills Totais" value={totalKills} />
        <StatCard title="Dano Total" value={totalDamage} />
        <StatCard title="Mortes Totais" value={totalDeaths} />
        <StatCard title="Assistências" value={totalAssists} />
        <StatCard title="Registros" value={totalMatches} />
      </section>

      <PremiumLocked
        onOpen={() => setShowVipPopup(true)}
        title="Gestão Completa do Squad"
        description="Defina analista, coach, capitão, funções e lineup competitivo."
      >
        <section className="mb-8 bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Crown size={26} className="text-orange-500" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Gestão Completa do Squad</h2>
              <p className="text-gray-400">
                Organize a estrutura competitiva da equipe.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="text-orange-500 font-bold mb-3 block">
                Analista
              </label>

              <input
                value={analyst}
                onChange={(e) => setAnalyst(e.target.value)}
                placeholder="Nome do analista da equipe"
                className="w-full bg-[#111827] border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-orange-500 font-bold mb-3 block">
                Coach
              </label>

              <input
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                placeholder="Nome do coach da equipe"
                className="w-full bg-[#111827] border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="text-orange-500 font-bold mb-3 block">
                Capitão
              </label>

              <select
                value={captain}
                onChange={(e) => setCaptain(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              >
                <option value="">Selecionar capitão</option>

                {teamPlayers.map((player: any) => (
                  <option key={player.id} value={player.player_name}>
                    {player.player_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-2">Capitão atual</p>

              <h3 className="text-2xl font-black text-white">
                {captain || "Nenhum capitão definido"}
              </h3>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="text-xl font-black">Lineup e Funções</h3>
            </div>

            {teamPlayers.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Adicione players para configurar o lineup.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400">
                    <tr>
                      <th className="p-4">Player</th>
                      <th className="p-4">Função</th>
                      <th className="p-4">Lineup</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teamPlayers.map((player: any) => (
                      <tr key={player.id} className="border-t border-white/10">
                        <td className="p-4 font-bold">{player.player_name}</td>

                        <td className="p-4">
                          <select
                            value={roles[player.player_name] || ""}
                            onChange={(e) =>
                              updateRole(player.player_name, e.target.value)
                            }
                            className="bg-[#0B0F1A] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                          >
                            <option value="">Definir função</option>
                            <option value="RUSH1">RUSH1</option>
                            <option value="RUSH2">RUSH2</option>
                            <option value="RUSH3">RUSH3</option>
                            <option value="GRANADEIRO">GRANADEIRO</option>
                            <option value="SUPORTE">SUPORTE</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <select
                            value={lineup[player.player_name] || ""}
                            onChange={(e) =>
                              updateLineup(player.player_name, e.target.value)
                            }
                            className="bg-[#0B0F1A] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                          >
                            <option value="">Definir lineup</option>
                            <option value="Titular">Titular</option>
                            <option value="Reserva">Reserva</option>
                            <option value="Teste">Teste</option>
                          </select>
                        </td>

                        <td className="p-4">
                          {captain === player.player_name ? (
                            <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-2 rounded-xl font-bold">
                              <Crown size={16} />
                              Capitão
                            </span>
                          ) : (
                            <span className="text-gray-400">Player</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button
            onClick={saveSquadConfig}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 transition rounded-2xl py-5 font-black text-lg flex items-center justify-center gap-3"
          >
            <Save size={22} />
            SALVAR GESTÃO DO SQUAD
          </button>
        </section>
      </PremiumLocked>

      <PremiumLocked
        onOpen={() => setShowVipPopup(true)}
        title="Análise Profissional do Squad"
        description="Veja KD geral, dano médio, impacto e leitura competitiva."
      >
        <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <ProCard
            icon={<Shield size={24} />}
            title="KD Geral"
            value={teamKD}
            description="Eficiência da equipe em combate"
          />

          <ProCard
            icon={<Star size={24} />}
            title="Dano Médio"
            value={avgDamage}
            description="Média de dano por registro"
          />

          <ProCard
            icon={<Users size={24} />}
            title="Players"
            value={teamPlayers.length}
            description="Membros ativos no squad"
          />
        </section>
      </PremiumLocked>

      <section className="mb-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Estatísticas por Player</h2>
        </div>

        {playerStats.length === 0 ? (
          <div className="p-10 text-gray-400 text-center">
            Nenhum player adicionado à equipe.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-4">Player</th>
                  <th className="p-4">Origem</th>
                  <th className="p-4">Kills</th>
                  <th className="p-4">Dano</th>
                  <th className="p-4">Mortes</th>
                  <th className="p-4">Assist.</th>
                  <th className="p-4">Registros</th>
                </tr>
              </thead>

              <tbody>
                {playerStats.map((player: any) => (
                  <tr
                    key={player.name}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-bold text-white">{player.name}</td>
                    <td className="p-4 text-orange-400 font-bold">
                      {player.source}
                    </td>
                    <td className="p-4 text-orange-500 font-bold">
                      {player.kills}
                    </td>
                    <td className="p-4">{player.damage}</td>
                    <td className="p-4">{player.deaths}</td>
                    <td className="p-4">{player.assists}</td>
                    <td className="p-4">{player.matches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-8 bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-4">Adicionar players à equipe</h2>

        {availablePlayers.length === 0 ? (
          <p className="text-gray-400">
            Nenhum player cadastrado. Crie players na aba Players ou analise uma
            screenshot.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availablePlayers.map((player: any) => {
              const existingPlayer = teamPlayers.find(
                (teamPlayer: any) =>
                  teamPlayer.player_name?.toLowerCase() ===
                  player.name?.toLowerCase()
              );

              const alreadyAdded = Boolean(existingPlayer);

              return (
                <div
                  key={`${player.source}-${player.name}`}
                  className="flex items-center justify-between bg-[#111827] hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 transition rounded-2xl p-4"
                >
                  <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-sm text-orange-400 font-bold">
                      {player.source}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {alreadyAdded && (
                      <button
                        onClick={() => removePlayer(existingPlayer.id)}
                        className="text-orange-500 hover:text-red-500 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}

                    <button onClick={() => addPlayerToTeam(player)}>
                      {addingPlayer === player.name ? (
                        <Check className="text-green-400" />
                      ) : (
                        <UserPlus className="text-orange-500" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Minha Equipe</h2>
        </div>

        {teamPlayers.length === 0 ? (
          <div className="p-10 text-gray-400 text-center">
            Nenhum player adicionado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-4">Player</th>
                  <th className="p-4">Origem</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {teamPlayers.map((player) => (
                  <tr
                    key={player.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-bold text-white">
                      {player.player_name}
                    </td>

                    <td className="p-4 text-orange-400 font-bold">
                      {player.source === "ia" ? "IA" : "Manual"}
                    </td>

                    <td className="p-4 text-gray-400">
                      {new Date(player.created_at).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="text-orange-500 hover:text-red-500 transition"
                      >
                        <Trash2 size={22} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showVipPopup && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="relative max-w-xl w-full bg-gradient-to-b from-[#111827] to-black border border-orange-500/30 rounded-[35px] p-8 text-center overflow-hidden">
            <button
              onClick={() => setShowVipPopup(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/5 hover:bg-red-500/20 border border-white/10 flex items-center justify-center z-20"
            >
              <X size={22} />
            </button>

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                <Crown size={40} className="text-orange-500" />
              </div>

              <h2 className="text-4xl font-black mb-4">Gestão VIP</h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Desbloqueie gestão completa de squads, capitão, lineup titular,
                reservas, funções, coach, analista e análise profissional.
              </p>

              <a
                href="/premium"
                className="block bg-orange-500 hover:bg-orange-600 transition py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-500/20"
              >
                VIRAR VIP
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PremiumLocked({
  children,
  onOpen,
  title,
  description,
}: any) {
  if (USER_IS_VIP) return <>{children}</>;

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="absolute top-6 left-6 z-20">
        <div className="flex items-center gap-3 mb-2">
          <Gem size={24} className="text-orange-500" />

          <h2 className="text-2xl font-black text-white">{title}</h2>
        </div>

        <p className="text-gray-400 text-sm max-w-md">{description}</p>
      </div>

      <div className="blur-[10px] opacity-20 pointer-events-none select-none">
        {children}
      </div>

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 flex items-center justify-center z-30">
        <button
          onClick={onOpen}
          className="bg-[#111827]/90 border border-orange-500/40 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:scale-105 transition"
        >
          <div className="flex items-center gap-3">
            <Gem size={22} className="text-orange-500" />

            <span className="font-black text-white">Desbloquear VIP</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <p className="text-gray-400 mb-2">{title}</p>
      <h2 className="text-4xl font-black text-orange-500">{value}</h2>
    </div>
  );
}

function ProCard({ icon, title, value, description }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-5">
        {icon}
      </div>

      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h2 className="text-4xl font-black text-orange-500 mb-2">{value}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
