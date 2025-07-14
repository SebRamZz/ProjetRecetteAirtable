"use client";

import { AIRecipeSheet } from "@/components/AiRecipeSheet";
import { MainHeader } from "@/components/MainHeader";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeSidebar } from "@/components/RecipeSidebar";
import { Input } from "@/components/ui/input";
import { searchRecettes } from "@/lib/api";
import { Recette } from "@/types/Recette";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

async function fetchRecettes(query: string): Promise<Recette[]> {
  if (query.trim()) {
    return searchRecettes(query);
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${baseUrl}/api/recette`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch recettes");
  return res.json();
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);

  const {
    data: recettes = [],
    isLoading,
    isError,
  } = useQuery<Recette[]>({
    queryKey: ["recettes", query],
    queryFn: () => fetchRecettes(query),
    refetchOnWindowFocus: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <MainHeader onOpenAiSheet={() => setIsAiSheetOpen(true)} />

      <main className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Découvrez des recettes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explorez notre collection de recettes délicieuses ou créez-en de
            nouvelles avec l'aide de l'IA
          </p>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher une recette, un ingrédient ou un type de plat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:ring-orange-400 shadow-lg bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Recipe Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center py-20">Chargement...</div>
          ) : isError ? (
            <div className="col-span-full text-center py-20 text-red-500">
              Erreur lors du chargement des recettes.
            </div>
          ) : recettes.length > 0 ? (
            recettes.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onClick={() => setActiveId(r.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Aucune recette trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez une autre recherche ou créez-en une nouvelle avec
                  l'IA!
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <AIRecipeSheet
        open={isAiSheetOpen}
        onOpenChange={setIsAiSheetOpen}
        onRecipeSaved={(newRecipe) => {
          const queryClient = useQueryClient();
          queryClient.invalidateQueries({ queryKey: ["recettes"] });
        }}
      />

      <RecipeSidebar recipeId={activeId} onClose={() => setActiveId(null)} />
    </div>
  );
}
