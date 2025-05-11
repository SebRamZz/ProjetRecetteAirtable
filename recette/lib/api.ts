import {base} from "@/utils/airtable";

export const getUserByEmail = async (email: string) => {
    return base("User")
        .select({
            filterByFormula: `email = "${email}"`,
            maxRecords: 1,
        })
        .firstPage();
};
export const register = async (data: {
    firstname: string;
    lastname:  string;
    email:     string;
    password:  string;
}) => {
    const { firstname, lastname, email, password } = data;
    try {
        // 1) Le nom de la table : "User" (tel qu’on le voit dans Airtable)
        // 2) On passe un tableau de records à créer, chacun avec un champ `fields`
        const records = await base("User").create([
            {
                fields: {
                    // 3) Les clés EXACTES de vos colonnes Airtable
                    firstname,
                    lastname,
                    email,
                    password,   // ou "passwordHash" si vous aviez renommé la colonne
                },
            },
        ]);
        // on renvoie le premier record créé
        return records[0];
    } catch (err: any) {
        console.error("❌ Airtable create error:", err);
        throw new Error("Failed to create user");
    }
};

