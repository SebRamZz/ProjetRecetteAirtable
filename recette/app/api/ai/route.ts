import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { ingredients, nb_personnes, intolerances } = await req.json();
    if (!ingredients || !nb_personnes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://ollama:11434";
    const prompt = `Tu es un assistant qui génère des recettes pour une base Airtable. 

        **FORMAT STRICT :**
        - RÉPONSE UNIQUEMENT : l'objet JSON, rien d'autre
        - PAS de backticks, PAS de blocs de code, PAS de texte avant/après
        - Commence par { et termine par }
        - Si tu ne respectes pas ce format, la réponse sera rejetée
        - Répondre uniquement en français

        Champs attendus :
        - name (string)
        - description (string)
        - ingredients (string, liste simple d'ingrédients séparés par des virgules, SANS guillemets autour de chaque ingrédient)
        - nb_personnes (nombre)
        - intoleranceAlimentaire (string, ou "" si aucune)
        - calories (nombre)
        - proteines (nombre)
        - glucides (nombre)
        - lipides (nombre)
        - vitamines (string)
        - mineraux (string)

        Contraintes :
        - Utilise uniquement les ingrédients fournis : ${ingredients}
        - Pour ${nb_personnes} personnes
        - Respecte strictement les intolérances alimentaires suivantes : ${intolerances || "aucune"} (n'en invente pas d'autres, si aucune, mets "" ou null)
        - IMPORTANT : Le champ "intoleranceAlimentaire" doit contenir les intolérances fournies : ${intolerances || "aucune"}
        - Si une valeur n'est pas connue, devine une valeur raisonnable. Ne laisse aucun champ vide sauf les intolérences alimentaires.
        - IMPORTANT : Pour les ingrédients, utilise une simple liste séparée par des virgules, SANS guillemets autour de chaque ingrédient
        - N’inclus que les champs explicitement listés dans l’exemple, sans ajouter de champs supplémentaires, même optionnels.
        - Utilise uniquement la syntaxe JSON standard : pas de =, pas de champs non listés, pas de commentaires.

        Exemple de réponse attendue :
        {
        "name": "Poulet aux légumes",
        "description": "Un plat savoureux et équilibré.",
        "ingredients": "600 g de blanc de poulet coupé en morceaux, 250 g de tomates fines, 1/2 ognon émincé, 300 g de riz cuit",
        "nb_personnes": 4,
        "intoleranceAlimentaire": "gluten, lactose",
        "calories": 450,
        "proteines": 35,
        "glucides": 20,
        "lipides": 15,
        "vitamines": "A: 500, C: 30",
        "mineraux": "Fer: 2, Calcium: 100"
        }

        Commence ta réponse directement par une accolade ouvrante { et termine par une accolade fermante }.`;

    const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3",
        prompt,
        stream: false
      })
    });

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error("[Ollama API Error] Status:", ollamaRes.status, "Body:", errorText);
      return NextResponse.json({ error: "Ollama error", status: ollamaRes.status, details: errorText }, { status: 500 });
    }

    const data = await ollamaRes.json();
    return NextResponse.json({ response: data.response });
  } catch (err) {
    console.error("[AI API] Error:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
} 