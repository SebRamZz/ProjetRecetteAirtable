"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
} from "@/components/ui/sheet";
import {RecetteDetail} from "@/app/api/recette/route";

export function RecipeSidebar({
                                  recipeId,
                                  onClose,
                              }: {
    recipeId: string | null;
    onClose: () => void;
}) {
    const [detail, setDetail] = useState<RecetteDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!recipeId) {
            setDetail(null);
            return;
        }
        setLoading(true);
        fetch(`/api/recette/${recipeId}`)
            .then((r) => r.json())
            .then((json) => setDetail(json))
            .finally(() => setLoading(false));
    }, [recipeId]);

    return (
        <Sheet
            open={!!recipeId}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >

            <SheetContent side="right" className="w-[600px] max-w-full">
                <SheetHeader>
                    <SheetTitle>Détails de la recette</SheetTitle>
                    <SheetDescription>
                        Toutes les infos de la recette
                    </SheetDescription>
                </SheetHeader>

                {loading && <p>Chargement…</p>}

                {detail && (
                    <div className="space-y-4 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                        {detail.fields.images?.[0]?.url && (
                            <Image
                                src={detail.fields.images[0].url}
                                alt={detail.fields.name}
                                width={400}
                                height={250}
                                className="rounded-lg object-cover"
                            />
                        )}

                        <h1 className="text-4xl font-bold">{detail.fields.name}</h1>
                        {detail.fields.description && <p>{detail.fields.description}</p>}
                        <p>Pour {detail.fields.nb_personnes} personnes</p>

                        <h2 className="font-semibold text-xl">Ingrédients</h2>
                        <pre className="whitespace-pre-wrap">{detail.fields.ingredients}</pre>

                        <h2 className="font-semibold text-xl">Nutrition</h2>
                        <ul className="list-disc list-inside">
                            <li>Calories : {detail.fields.calories} kcal</li>
                            <li>Protéines : {detail.fields.proteines} g</li>
                            <li>Glucides : {detail.fields.glucides} g</li>
                            <li>Lipides : {detail.fields.lipides} g</li>
                        </ul>

                        {Array.isArray(detail.fields.intoleranceAlimentaire) &&
                            detail.fields.intoleranceAlimentaire.length > 0 && (
                                <>
                                    <h3 className="font-semibold">Intolérances</h3>
                                    <p>{detail.fields.intoleranceAlimentaire.join(", ")}</p>
                                </>
                            )}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
