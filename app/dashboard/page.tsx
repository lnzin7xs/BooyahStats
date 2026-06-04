"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Crown,
  Gem,
  Swords,
  X,
  Activity,
  Target,
  TrendingUp,
  Trophy,
  Brain,
  BarChart3,
  Zap,
  Users,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const USER_IS_VIP = false; // Simulação de status VIP - ajustar conforme lógica real

export default function DashboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [showVipPopup, setShowVipPopup] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: matchesData } = await supabase.from("matches").select("*");
    const { data: manualData } = await supabase.from("manual_players").select("*");
    const { data: teamsData } = await supabase.from("teams").select("*");
    const { data: teamPlayersData } = await supabase.from("team_players").select("*");

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

    const finalPlayers = Object.values(grouped) as any[];

    const finalTeams = (teamsData || []).map((team: any) => {
      const members = (teamPlayersData || []).filter(
        (item: any) => item.team_id === team.id
      );

      const stats = members.reduce(
        (acc: any, member: any) => {
          const player = finalPlayers.find(
            (p: any) =>
              p.name?.toLowerCase() === member.player_name?.toLowerCase()
          );

          if (player) {
            acc.kills += player.kills || 0;
            acc.damage += player.damage || 0;
            acc.deaths += player.deaths || 0;
            acc.assists += player.assists || 0;
            acc.matches += player.matches || 0;
          }

          return acc;
        },
        {
          kills: 0,
          damage: 0,
          deaths: 0,
          assists: 0,
          matches: 0,
        }
      );

      return {
        ...team,
        ...stats,
        players: members.length,
      };
    });

    setPlayers(finalPlayers.sort((a: any, b: any) => b.kills - a.kills));
    setTeams(finalTeams);
  }

  const selectedPlayerA = players.find((p) => p.name === playerA);
  const selectedPlayerB = players.find((p) => p.name === playerB);
  const selectedTeamA = teams.find((t) => t.id === teamA);
  const selectedTeamB = teams.find((t) => t.id === teamB);

  const totalKills = players.reduce((acc, p) => acc + (p.kills || 0), 0);
  const totalDamage = players.reduce((acc, p) => acc + (p.damage || 0), 0);
  const totalDeaths = players.reduce((acc, p) => acc + (p.deaths || 0), 0);
  const totalMatches = players.reduce((acc, p) => acc + (p.matches || 0), 0);
  const totalAssists = players.reduce((acc, p) => acc + (p.assists || 0), 0);

  const avgKills = totalMatches > 0 ? (totalKills / totalMatches).toFixed(1) : "0";
  const avgDamage = totalMatches > 0 ? Math.round(totalDamage / totalMatches) : 0;
  const kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills;
  const assistRate = totalMatches > 0 ? (totalAssists / totalMatches).toFixed(1) : "0";

  const bestPlayer = [...players].sort((a, b) => {
    const scoreA = (a.kills || 0) * 2 + (a.assists || 0) + (a.damage || 0) / 300;
    const scoreB = (b.kills || 0) * 2 + (b.assists || 0) + (b.damage || 0) / 300;
    return scoreB - scoreA;
  })[0];

  const bestTeam = [...teams].sort((a, b) => (b.kills || 0) - (a.kills || 0))[0];

  const consistency = Math.min(
    100,
    Math.round(Number(kd) * 18 + Number(avgKills) * 8 + totalMatches * 2)
  );

  const performanceLabel =
    consistency >= 80
      ? "Dominante"
      : consistency >= 55
      ? "Competitivo"
      : consistency >= 30
      ? "Em evolução"
      : "Inicial";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white p-6 lg:pl-32 pt-20 lg:pt-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-5xl font-black text-orange-500">
              Dashboard
            </h1>

            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-sm font-black">
              PRO
            </span>
          </div>

          <p className="text-gray-400">
            Acompanhe seus dados básicos e desbloqueie análises competitivas no VIP.
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

      {/* DASHBOARD BÁSICO FREE */}

      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <BarChart3 size={26} className="text-orange-500" />
          </div>

          <div>
            <h2 className="text-2xl font-black">Resumo Básico</h2>
            <p className="text-gray-400">
              Dados principais disponíveis para todos os usuários.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <BasicCard
            icon={<Users size={24} />}
            title="Players"
            value={players.length}
            description="Jogadores registrados"
          />

          <BasicCard
            icon={<Shield size={24} />}
            title="Equipes"
            value={teams.length}
            description="Squads criados"
          />

          <BasicCard
            icon={<Target size={24} />}
            title="Kills totais"
            value={totalKills}
            description="Eliminações registradas"
          />

          <BasicCard
            icon={<Activity size={24} />}
            title="Registros"
            value={totalMatches}
            description="Partidas/análises salvas"
          />
        </div>
      </section>

      {/* RANKING BÁSICO FREE */}

      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={28} className="text-orange-500" />

          <div>
            <h2 className="text-2xl font-black">Top Players</h2>
            <p className="text-gray-400">
              Ranking básico por kills totais.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {players.slice(0, 3).map((player, index) => (
            <div
              key={player.name}
              className="bg-[#111827] border border-white/10 rounded-3xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-orange-500 font-black text-2xl">
                  #{index + 1}
                </span>

                <Trophy size={22} className="text-orange-500" />
              </div>

              <h3 className="text-2xl font-black mb-2">{player.name}</h3>

              <p className="text-gray-400 text-sm">
                {player.kills || 0} kills • {player.matches || 0} registros
              </p>
            </div>
          ))}

          {players.length === 0 && (
            <div className="text-gray-400">
              Nenhum player registrado ainda.
            </div>
          )}
        </div>
      </section>

      {/* VIP BORRADO */}

      <PremiumLocked
        onOpen={() => setShowVipPopup(true)}
        title="Resumo Competitivo"
        description="Métricas PRO como KD, dano médio, consistência e performance."
      >
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <BarChart3 size={26} className="text-orange-500" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Resumo Competitivo</h2>
              <p className="text-gray-400">
                Indicadores profissionais calculados com base nos dados salvos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <ProCard icon={<Target size={24} />} title="Kills por partida" value={avgKills} description="Média ofensiva geral" />
            <ProCard icon={<Activity size={24} />} title="Dano médio" value={avgDamage} description="Impacto por registro" />
            <ProCard icon={<Zap size={24} />} title="KD geral" value={kd} description="Eficiência em combate" />
            <ProCard icon={<TrendingUp size={24} />} title="Consistência" value={`${consistency}%`} description={performanceLabel} />
          </div>
        </section>
      </PremiumLocked>

      <PremiumLocked
        onOpen={() => setShowVipPopup(true)}
        title="Performance Geral"
        description="Veja o nível competitivo atual e evolução do desempenho."
      >
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={28} className="text-orange-500" />

              <div>
                <h2 className="text-2xl font-black">Performance Geral</h2>
                <p className="text-gray-400">
                  Leitura visual do momento competitivo.
                </p>
              </div>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-bold">Nível atual</span>
                <span className="text-orange-500 font-black">
                  {performanceLabel}
                </span>
              </div>

              <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: `${consistency}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <MiniStat label="Registros" value={totalMatches} />
              <MiniStat label="Assist. média" value={assistRate} />
              <MiniStat label="Dano total" value={totalDamage} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy size={28} className="text-orange-500" />

              <div>
                <h2 className="text-2xl font-black">Destaques</h2>
                <p className="text-gray-400">Principais nomes do projeto.</p>
              </div>
            </div>

            <Highlight
              title="Melhor Player"
              value={bestPlayer?.name || "Sem dados"}
              description={`${bestPlayer?.kills || 0} kills registradas`}
            />

            <Highlight
              title="Equipe destaque"
              value={bestTeam?.name || "Sem dados"}
              description={`${bestTeam?.kills || 0} kills totais`}
            />
          </div>
        </section>
      </PremiumLocked>

      <PremiumLocked
        onOpen={() => setShowVipPopup(true)}
        title="Insights da IA"
        description="Receba análises automáticas sobre pontos fortes e fracos."
      >
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Brain size={28} className="text-orange-500" />
            </div>

            <div>
              <h2 className="text-2xl font-black">Insights da IA</h2>
              <p className="text-gray-400">
                Leitura automática baseada nas estatísticas atuais.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <InsightCard
              title="Ofensividade"
              text="Sua média de kills está em nível competitivo. O foco agora deve ser consistência."
            />

            <InsightCard
              title="Sobrevivência"
              text="Seu KD mostra boa eficiência em combate. Continue reduzindo mortes desnecessárias."
            />

            <InsightCard
              title="Impacto"
              text="O dano total mostra participação ativa nas partidas. Boa presença de combate."
            />
          </div>
        </section>
      </PremiumLocked>

      <PremiumLocked
        onOpen={() => setShowVipPopup(true)}
        title="Comparar Jogadores"
        description="Compare player contra player com gráfico e tabela."
      >
        <CompareSection
          title="Comparar Jogadores"
          options={players.map((p) => ({ id: p.name, name: p.name }))}
          valueA={playerA}
          valueB={playerB}
          setValueA={setPlayerA}
          setValueB={setPlayerB}
        />
      </PremiumLocked>

      {USER_IS_VIP && selectedPlayerA && selectedPlayerB && (
        <>
          <ComparisonChart itemA={selectedPlayerA} itemB={selectedPlayerB} />
          <ComparisonTable itemA={selectedPlayerA} itemB={selectedPlayerB} />
        </>
      )}

      <PremiumLocked
        onOpen={() => setShowVipPopup(true)}
        title="Comparar Equipes"
        description="Compare squad contra squad com dados competitivos."
      >
        <CompareSection
          title="Comparar Equipes"
          options={teams.map((t) => ({ id: t.id, name: t.name }))}
          valueA={teamA}
          valueB={teamB}
          setValueA={setTeamA}
          setValueB={setTeamB}
        />
      </PremiumLocked>

      {USER_IS_VIP && selectedTeamA && selectedTeamB && (
        <>
          <ComparisonChart itemA={selectedTeamA} itemB={selectedTeamB} />
          <ComparisonTable itemA={selectedTeamA} itemB={selectedTeamB} />
        </>
      )}

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

              <h2 className="text-4xl font-black mb-4">Dashboard PRO</h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Desbloqueie métricas competitivas, insights da IA, performance
                avançada, comparações e análise profissional de desempenho.
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
  title = "Recurso VIP",
  description = "Função exclusiva para usuários VIP.",
}: any) {
  if (USER_IS_VIP) return <>{children}</>;

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      {/* TÍTULO VISÍVEL DA FUNÇÃO */}
      <div className="absolute top-6 left-6 z-20">
        <div className="flex items-center gap-3 mb-2">
          <Gem size={24} className="text-orange-500" />

          <h2 className="text-2xl font-black text-white">
            {title}
          </h2>
        </div>

        <p className="text-gray-400 text-sm max-w-md">
          {description}
        </p>
      </div>

      {/* CONTEÚDO BLOQUEADO */}
      <div className="blur-[10px] opacity-20 pointer-events-none select-none">
        {children}
      </div>

      {/* CAMADA ESCURA */}
      <div className="absolute inset-0 bg-black/45" />

      {/* BOTÃO VIP MENOR */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <button
          onClick={onOpen}
          className="bg-[#111827]/90 border border-orange-500/40 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:scale-105 transition"
        >
          <div className="flex items-center gap-3">
            <Gem size={22} className="text-orange-500" />

            <span className="font-black text-white">
              Desbloquear VIP
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function BasicCard({ icon, title, value, description }: any) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-5">
        {icon}
      </div>

      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-4xl font-black text-white mb-2">{value}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

function ProCard({ icon, title, value, description }: any) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-5">
        {icon}
      </div>

      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-4xl font-black text-white mb-2">{value}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

function MiniStat({ label, value }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-gray-500 text-xs font-bold mb-1">{label}</p>
      <h4 className="text-orange-500 font-black text-xl">{value}</h4>
    </div>
  );
}

function Highlight({ title, value, description }: any) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 mb-4">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-black mb-1">{value}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

function InsightCard({ title, text }: any) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <Brain size={22} className="text-orange-500" />
        <h3 className="text-xl font-black">{title}</h3>
      </div>

      <p className="text-gray-400 leading-relaxed">{text}</p>
    </div>
  );
}

function CompareSection({
  title,
  options,
  valueA,
  valueB,
  setValueA,
  setValueB,
}: any) {
  return (
    <section className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-5">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <SelectBox value={valueA} setValue={setValueA} options={options} />

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Swords size={34} />
          </div>
        </div>

        <SelectBox value={valueB} setValue={setValueB} options={options} />
      </div>
    </section>
  );
}

function SelectBox({ value, setValue, options }: any) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full bg-[#111827] border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-orange-500 transition"
    >
      <option value="">Selecionar</option>

      {options.map((option: any) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

function ComparisonChart({ itemA, itemB }: any) {
  return null;
}

function ComparisonTable({ itemA, itemB }: any) {
  return null;
}