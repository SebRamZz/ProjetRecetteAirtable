"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RecipeSidebar } from "./RecipeSidebar";
import { Recette } from "@/app/api/recette/route";
import { searchRecettes } from "@/lib/api";
import { Input } from "@/components/ui/input";

export default function ClientRecetteList({ recettes: initialRecettes }: { recettes: Recette[] }) {
    const [query, setQuery] = useState("");
    const [recettes, setRecettes] = useState<Recette[]>(initialRecettes);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!query.trim()) {
                setRecettes(initialRecettes);
                return;
            }

            searchRecettes(query)
                .then(setRecettes)
                .catch(console.error);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <>
            <div className="p-4 w-1/2 mx-auto">
                <Input
                    placeholder="Rechercher une recette, un ingrédient ou un type de plat..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mb-6"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 pb-6">
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
                                Pour {r.fields.nb_personnes ?? "?"} personnes
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <RecipeSidebar
                recipeId={activeId}
                onClose={() => setActiveId(null)}
            />
        </>
    );
}
