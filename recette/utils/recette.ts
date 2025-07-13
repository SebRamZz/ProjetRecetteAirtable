import { base } from "@/utils/airtable";

export async function getRecetteById(id: string) {
    const record = await base("Recette").find(id);
    return { id: record.id, fields: record.fields as any };
} 