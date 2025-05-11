// app/recette/page.tsx
import ClientRecetteList from "@/components/ClientRecetteList";
import {listRecettes, Recette} from "@/app/api/recette/route";

export default async function RecettePage() {
    const recettes: Recette[] = await listRecettes();
    return <ClientRecetteList recettes={recettes} />;
}
