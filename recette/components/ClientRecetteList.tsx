"use client";

import { useState } from "react";
import Image from "next/image";
import { RecipeSidebar } from "./RecipeSidebar";
import {Recette} from "@/app/api/recette/route";

export default function ClientRecetteList({ recettes }: { recettes: Recette[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {recettes.map((r) => (
                    <div
                        key={r.id}
                        className="cursor-pointer bg-white rounded-xl shadow overflow-hidden w-full"
                        onClick={() => setActiveId(r.id)}
                    >
                        {r.fields.images?.[0]?.url && (
                            <Image
                                src={r.fields.images[0].url}
                                alt={r.fields.name}
                                width={360}
                                height={200}
                                className="object-cover w-full h-44"
                            />
                        )}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold line-clamp-2">
                                {r.fields.name}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Pour {r.fields.nb_personnes} personnes
                            </p>
                        </div>
                    </div>
                ))}
            </div>


            {/* La sidebar Shadcn qui s’ouvre si activeId != null */}
            <RecipeSidebar
                recipeId={activeId}
                onClose={() => setActiveId(null)}
            />
        </>
    );
}
