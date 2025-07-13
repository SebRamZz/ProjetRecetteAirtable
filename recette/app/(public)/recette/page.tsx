// app/recette/page.tsx
import ClientRecetteList from "@/components/ClientRecetteList";

export default async function RecettePage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const res = await fetch(`${baseUrl}/api/recette`, { cache: "no-store" });
    const recettes = await res.json();
    return <ClientRecetteList recettes={recettes} />;
}
