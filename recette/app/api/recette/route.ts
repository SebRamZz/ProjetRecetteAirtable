import { base } from "@/utils/airtable";
import { NextResponse } from "next/server";

export type Recette = {
    id: string;
    fields: {
        name: string;
        description?: string;
        nb_personnes?: number;
        images?: { url: string }[];
    };
};

export type RecetteDetail = {
    id: string;
    fields: {
        name: string;
        description?: string;
        ingredients?: string;
        nb_personnes?: number;
        images?: { url: string }[];
        typePlat?: string;
        intoleranceAlimentaire?: string[];
        calories?: number;
        proteines?: number;
        glucides?: number;
        lipides?: number;
        vitamines?: Record<string, number>;
        mineraux?: Record<string, number>;
    };
};

export async function GET() {
    try {
        const records = await base("Recette")
            .select({ view: "Grid view" })
            .firstPage();
        const recettes = records.map((r) => ({ id: r.id, fields: r.fields as any }));
        return NextResponse.json(recettes);
    } catch (err) {
        console.error("[Airtable] Error fetching recipes:", err);
        return NextResponse.json({ error: "Erreur lors de la récupération des recettes." }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, ingredients, nb_personnes, images, intoleranceAlimentaire, calories, proteines, glucides, lipides, vitamines, mineraux } = body;
        const created = await base("Recette").create([
            {
                fields: {
                    name,
                    description,
                    ingredients,
                    nb_personnes,
                    images,
                    intoleranceAlimentaire,
                    calories,
                    proteines,
                    glucides,
                    lipides,
                    vitamines,
                    mineraux,
                },
            },
        ]);
        return NextResponse.json({ id: created[0].id, fields: created[0].fields }, { status: 201 });
    } catch (err) {
        console.error("[Airtable] Error creating recipe:", err);
        return NextResponse.json({ error: "Erreur lors de l'enregistrement dans Airtable." }, { status: 500 });
    }
}