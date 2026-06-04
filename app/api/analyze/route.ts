import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image") as File | null;
    const mode = formData.get("mode") as string | null;

    if (!image) {
      return NextResponse.json(
        { error: "Nenhuma imagem enviada." },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();

    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `
Você é uma IA especializada em analisar screenshots de estatísticas do Free Fire.

O modo selecionado pelo usuário é: ${mode || "desconhecido"}.

Regras:

Se o modo for "BATTLE_ROYALE":
- Extraia as estatísticas dos jogadores do squad/time visível.
- Retorne em "players".

Se o modo for "CONTRA_SQUAD":
- A imagem geralmente mostra dois times.
- Separe os jogadores em dois grupos:
  1. teamBlue
  2. teamOrange
- Não misture os dois times.
- Extraia nome, KDA e dano de cada jogador.
- O placar deve ir em "score".
- O vencedor deve ir em "winner".

Retorne SOMENTE um JSON válido, sem markdown, sem texto extra.

Formato obrigatório:

{
  "mode": "BATTLE_ROYALE ou CONTRA_SQUAD",
  "players": [
    {
      "name": "nome do jogador",
      "kills": 0,
      "deaths": 0,
      "assists": 0,
      "damage": 0,
      "revives": 0,
      "survivalTime": "00:00"
    }
  ],
  "teamBlue": [
    {
      "name": "nome do jogador",
      "kills": 0,
      "deaths": 0,
      "assists": 0,
      "damage": 0
    }
  ],
  "teamOrange": [
    {
      "name": "nome do jogador",
      "kills": 0,
      "deaths": 0,
      "assists": 0,
      "damage": 0
    }
  ],
  "match": {
    "map": "desconhecido",
    "placement": 0,
    "booyah": false,
    "scoreBlue": 0,
    "scoreOrange": 0,
    "winner": "desconhecido",
    "confidence": 0
  }
}

Se algum dado não aparecer, use 0 ou "desconhecido".
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: image.type,
                    data: base64Image,
                  },
                },

                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("RESPOSTA GEMINI:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("JSON LIMPO:", cleanText);

    const stats = JSON.parse(cleanText);

    console.log("STATS:", stats);

    // =========================
    // CONTRA SQUAD
    // =========================

    if (stats.mode === "CONTRA_SQUAD") {

      const bluePlayers = (stats.teamBlue || []).map((player: any) => ({
        mode: stats.mode,

        player_name: player.name,

        kills: player.kills || 0,

        deaths: player.deaths || 0,

        assists: player.assists || 0,

        damage: player.damage || 0,

        team: "BLUE",
      }));

      const orangePlayers = (stats.teamOrange || []).map((player: any) => ({
        mode: stats.mode,

        player_name: player.name,

        kills: player.kills || 0,

        deaths: player.deaths || 0,

        assists: player.assists || 0,

        damage: player.damage || 0,

        team: "ORANGE",
      }));

      console.log("PLAYERS BLUE:", bluePlayers);

      console.log("PLAYERS ORANGE:", orangePlayers);

      const { data: insertData, error } = await supabase
        .from("matches")
        .insert([...bluePlayers, ...orangePlayers])
        .select();

      console.log("SUPABASE INSERT:", insertData);

      if (error) {
        console.error("ERRO SUPABASE:", error);
      }

    } else {

      // =========================
      // BATTLE ROYALE
      // =========================

      const players = (stats.players || []).map((player: any) => ({
        mode: stats.mode,

        player_name: player.name,

        kills: player.kills || 0,

        deaths: player.deaths || 0,

        assists: player.assists || 0,

        damage: player.damage || 0,

        revives: player.revives || 0,

        survival_time: player.survivalTime || "00:00",

        team: "SQUAD",
      }));

      console.log("PLAYERS:", players);

      const { data: insertData, error } = await supabase
        .from("matches")
        .insert(players)
        .select();

      console.log("SUPABASE INSERT:", insertData);

      if (error) {
        console.error("ERRO SUPABASE:", error);
      }
    }

    return NextResponse.json({
      success: true,

      stats,

      debug: {
        mode: stats.mode,

        players: stats.players?.length || 0,

        teamBlue: stats.teamBlue?.length || 0,

        teamOrange: stats.teamOrange?.length || 0,
      },
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao analisar a imagem.",
      },
      { status: 500 }
    );
  }
}