import {NextResponse} from "next/server";
import {getRecetteById} from "@/app/api/recette/route";

export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    try {
        const recette = await getRecetteById(params.id);
        return NextResponse.json(recette);
    } catch (err) {
        return NextResponse.json({message: "Non trouvé"}, {status: 404});
    }
}
