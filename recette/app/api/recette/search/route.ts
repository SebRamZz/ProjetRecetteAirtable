import { NextRequest, NextResponse } from "next/server";
import { base } from "@/utils/airtable";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  try {
    const formula = query
      ? `OR(
          FIND(LOWER("${query}"), LOWER({name})),
          FIND(LOWER("${query}"), LOWER({ingredients})),
          FIND(LOWER("${query}"), LOWER({typePlat}))
        )`
      : "";

    const records = await base("Recette")
      .select({
        view: "Grid view",
        ...(formula && { filterByFormula: formula }),
      })
      .firstPage();

    const recettes = records.map((r) => ({
      id: r.id,
      fields: r.fields,
    }));

    return NextResponse.json(recettes);
  } catch (error) {
    console.error("Erreur API recherche :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
