"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

export default function UploadSection() {
  const [selectedMode, setSelectedMode] = useState("BATTLE_ROYALE");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    setStats(null);
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("mode", selectedMode);

    try {
      setLoading(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("Erro ao analisar imagem.");
        return;
      }

      setStats(data.stats);
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-bold mb-4">
              Envie sua captura de tela
            </h3>

            <p className="text-gray-400 text-lg">
              Escolha o modo, envie a imagem e deixe a IA analisar suas
              estatísticas.
            </p>
          </div>

          <div className="mb-10">
            <p className="text-gray-300 font-bold mb-4 text-center">
              SELECIONE O MODO DA PARTIDA
            </p>

            <div className="max-w-md mx-auto">
              <select
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value);
                  setStats(null);
                }}
                className="w-full bg-[#111827] border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-orange-500 transition"
              >
                <option value="BATTLE_ROYALE">Battle Royale</option>
                <option value="CONTRA_SQUAD">Contra Squad</option>
              </select>
            </div>
          </div>

          <div className="border-2 border-dashed border-orange-500/40 rounded-3xl p-16 flex flex-col items-center justify-center text-center hover:border-orange-500 transition bg-[#111827]">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 mb-6">
              <ImageIcon size={72} className="text-orange-500" />
            </div>

            <h4 className="text-2xl font-bold mb-3">
              Arraste sua screenshot aqui
            </h4>

            <p className="text-gray-400 mb-6">
              ou clique para selecionar uma imagem
            </p>

            <label className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-2xl font-bold cursor-pointer">
              Imagem
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {selectedImage && (
              <>
                <div className="mt-8">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="rounded-2xl max-h-[400px] mx-auto border border-white/10"
                  />
                </div>

                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="mt-8 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-orange-500/20"
                >
                  {loading ? "Analisando..." : "Analisar Screenshot"}
                </button>
              </>
            )}
          </div>

          {stats?.mode === "CONTRA_SQUAD" && (
            <div className="mt-10">
              <div className="bg-[#111827] rounded-3xl border border-white/10 overflow-hidden mb-6">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-2xl font-bold text-orange-500">
                    Contra Squad
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Placar: {stats.match?.scoreBlue ?? 0} x{" "}
                    {stats.match?.scoreOrange ?? 0} • Vencedor:{" "}
                    {stats.match?.winner ?? "desconhecido"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamTable title="Time Azul" players={stats.teamBlue || []} />
                <TeamTable
                  title="Time Laranja"
                  players={stats.teamOrange || []}
                />
              </div>
            </div>
          )}

          {stats?.mode !== "CONTRA_SQUAD" && stats?.players && (
            <div className="mt-10 bg-[#111827] rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-orange-500">
                  Estatísticas do Squad
                </h3>

                <p className="text-gray-400 mt-2">
                  Posição #{stats.match?.placement ?? "?"} •{" "}
                  {stats.match?.booyah ? "BOOYAH 🔥" : "Sem Booyah"}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400">
                    <tr>
                      <th className="p-4">Player</th>
                      <th className="p-4">Kills</th>
                      <th className="p-4">Mortes</th>
                      <th className="p-4">Assist.</th>
                      <th className="p-4">Dano</th>
                      <th className="p-4">Revives</th>
                      <th className="p-4">Sobrevivência</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.players.map((player: any, index: number) => (
                      <tr
                        key={index}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="p-4 font-bold text-white">
                          {player.name}
                        </td>

                        <td className="p-4 text-orange-500 font-bold">
                          {player.kills}
                        </td>

                        <td className="p-4">{player.deaths}</td>

                        <td className="p-4">{player.assists}</td>

                        <td className="p-4">{player.damage}</td>

                        <td className="p-4">{player.revives}</td>

                        <td className="p-4">{player.survivalTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TeamTable({
  title,
  players,
}: {
  title: string;
  players: any[];
}) {
  return (
    <div className="bg-[#111827] rounded-3xl border border-white/10 overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <h3 className="text-xl font-bold text-orange-500">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4">Player</th>
              <th className="p-4">K</th>
              <th className="p-4">D</th>
              <th className="p-4">A</th>
              <th className="p-4">Dano</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player: any, index: number) => (
              <tr
                key={index}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 font-bold text-white">{player.name}</td>

                <td className="p-4 text-orange-500 font-bold">
                  {player.kills}
                </td>

                <td className="p-4">{player.deaths}</td>

                <td className="p-4">{player.assists}</td>

                <td className="p-4">{player.damage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}