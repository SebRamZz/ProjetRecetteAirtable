import { base } from "@/utils/airtable";

export type Recette = {
    id: string;
    fields: {
        name: string;
        description?: string;
        nb_personnes?: number;
        images?: { url: string }[];
    };
};

export async function listRecettes(): Promise<Recette[]> {
    const records = await base("Recette")
        .select({ view: "Grid view" })
        .firstPage();
    return records.map((r) => ({ id: r.id, fields: r.fields as any }));
}


export type RecetteDetail = {
    id: string;
    fields: {
        // Les champs que tu as dans ta table Airtable sous l’onglet Recette
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
        // Si tu stockes les vitamines et minéraux sous forme d’objet JSON
        vitamines?: Record<string, number>;
        mineraux?: Record<string, number>;
    };
};

// Exemples de fonctions existantes :
export async function getRecetteById(id: string): Promise<RecetteDetail> {
    const record = await base("Recette").find(id);
    return { id: record.id, fields: record.fields as any };
}