"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
  X,
  Gem,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function EquipePage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVipPopup, setShowVipPopup] = useState(false);

  const isVip = false;

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert("Erro ao buscar equipes.");
      return;
    }

    setTeams(data || []);
  }

  async function createTeam() {
    if (!teamName.trim()) {
      alert("Digite o nome da equipe.");
      return;
    }

    setLoading(true);

    let logoUrl = "";

    if (teamLogo) {
      const fileName = `${Date.now()}-${teamLogo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("team-logos")
        .upload(fileName, teamLogo);

      if (uploadError) {
        alert("Erro ao enviar logo: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("team-logos")
        .getPublicUrl(fileName);

      logoUrl = data.publicUrl;
    }

    const { error } = await supabase.from("teams").insert([
      {
        name: teamName.trim(),
        logo_url: logoUrl,
      },
    ]);

    if (error) {
      alert("Erro ao criar equipe: " + error.message);
      setLoading(false);
      return;
    }

    setTeamName("");
    setTeamLogo(null);
    setShowCreateModal(false);

    await fetchTeams();

    setLoading(false);
  }

  async function deleteTeam(id: string, e: any) {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = confirm("Tem certeza que deseja apagar esta equipe?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("teams").delete().eq("id", id);

    if (error) {
      alert("Erro ao apagar equipe.");
      return;
    }

    fetchTeams();
  }

  function handleOpenCreateTeam() {
    if (!isVip && teams.length >= 1) {
      setShowVipPopup(true);
      return;
    }

    setShowCreateModal(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white p-6 lg:pl-32 pt-20 lg:pt-6">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-black text-orange-500 mb-2">
            Equipes
          </h1>

          <p className="text-gray-400">
            Organize seus squads, personalize identidades e acompanhe a evolução
            competitiva.
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

      {/* LIST */}

      <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-2">Suas Equipes</h2>

        <p className="text-gray-400 mb-6">
          Gerencie squads, personalize logos e acompanhe o desempenho
          competitivo de cada equipe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {teams.map((team) => (
            <a
              key={team.id}
              href={`/equipe/${team.id}`}
              className="min-h-[250px] bg-[#111827] border border-white/10 rounded-3xl p-5 relative block hover:border-orange-500/40 hover:bg-orange-500/5 transition"
            >
              {/* DELETE */}

              <button
                onClick={(e) => deleteTeam(team.id, e)}
                className="absolute top-4 right-4 text-orange-500 hover:text-red-500 transition"
              >
                <Trash2 size={20} />
              </button>

              {/* LOGO */}

              {team.logo_url ? (
                <img
                  src={team.logo_url}
                  alt={team.name}
                  className="w-24 h-24 rounded-3xl object-cover mb-4 border border-white/10"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-4xl mb-4">
                  {team.name?.[0]}
                </div>
              )}

              {/* NAME */}

              <h3 className="text-2xl font-black text-white mb-2">
                {team.name}
              </h3>

              <p className="text-gray-400 text-sm">
                Criada em{" "}
                {new Date(team.created_at).toLocaleDateString("pt-BR")}
              </p>
            </a>
          ))}

          {/* CREATE CARD */}

          <button
            onClick={handleOpenCreateTeam}
            className="min-h-[250px] bg-[#111827] border-2 border-dashed border-orange-500/40 rounded-3xl p-5 flex flex-col items-center justify-center text-center hover:border-orange-500 hover:bg-orange-500/5 transition group"
          >
            <div className="w-24 h-24 rounded-3xl bg-orange-500/10 flex items-center justify-center mb-5 group-hover:scale-105 transition">
              <Plus size={48} className="text-orange-500" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              Nova Equipe
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              Monte um novo squad competitivo e personalize sua identidade.
            </p>
          </button>
        </div>
      </section>

      {/* CREATE MODAL */}

      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#151A25] via-[#080B12] to-black border border-orange-500/30 rounded-[36px] p-8 text-white">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center"
            >
              <X size={24} />
            </button>

            <h2 className="text-4xl font-black mb-2">Criar nova equipe</h2>

            <p className="text-gray-400 mb-8">
              Defina o nome, envie uma logo e crie a identidade visual do seu
              squad.
            </p>

            <div className="space-y-5">
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Nome da equipe"
                className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-orange-500"
              />

              <label className="w-full bg-[#111827] border border-white/10 rounded-2xl px-4 py-4 cursor-pointer flex items-center justify-between">
                <span className="text-gray-400 truncate">
                  {teamLogo ? teamLogo.name : "Selecionar logo da equipe"}
                </span>

                <Upload className="text-orange-500" />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setTeamLogo(e.target.files?.[0] || null)}
                />
              </label>

              <button
                onClick={createTeam}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition rounded-2xl font-black py-5 text-lg"
              >
                {loading ? "Criando equipe..." : "CRIAR EQUIPE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP POPUP */}

      {showVipPopup && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#151A25] via-[#080B12] to-black border border-orange-500/30 rounded-[36px] p-8 text-white overflow-hidden">
            <button
              onClick={() => setShowVipPopup(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center transition"
            >
              <X size={24} />
            </button>

            <div className="w-24 h-24 mx-auto rounded-[30px] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8">
              <Gem size={50} className="text-orange-500" />
            </div>

            <h2 className="text-5xl font-black text-center mb-4">
              Recurso VIP
            </h2>

            <p className="text-gray-400 text-center text-xl leading-relaxed mb-10">
              Usuários FREE podem criar apenas uma equipe.
              <br />
              Libere squads ilimitados, dashboard avançado, métricas
              profissionais e recursos competitivos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                "Equipes ilimitadas",
                "Dashboard competitivo",
                "Comparação avançada",
                "IA ilimitada",
                "Métricas profissionais",
                "Histórico completo",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3"
                >
                  <Gem size={18} className="text-orange-500" />

                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="/premium"
              className="w-full bg-orange-500 hover:bg-orange-600 transition py-5 rounded-2xl font-black text-2xl flex items-center justify-center shadow-[0_0_35px_rgba(249,115,22,0.35)]"
            >
              VIRAR VIP
            </a>
          </div>
        </div>
      )}
    </main>
  );
}