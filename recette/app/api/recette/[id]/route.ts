import { NextResponse } from "next/server";
import { getRecetteById } from "@/utils/recette";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const recette = await getRecetteById(id);
    return NextResponse.json(recette);
  } catch (err) {
    return NextResponse.json({ message: "Non trouvé" }, { status: 404 });
  }
}
