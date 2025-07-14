"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Recette } from "@/types/Recette";
import {
  Bookmark,
  ChefHat,
  Clock,
  Flame,
  Heart,
  Loader2,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface RecipeSidebarProps {
  recipeId: string | null;
  onClose: () => void;
}

export function RecipeSidebar({ recipeId, onClose }: RecipeSidebarProps) {
  const [recipe, setRecipe] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (recipeId) {
      setLoading(true);
      setError(null);
      // Simulate API call
      setTimeout(() => {
        // Mock data for demonstration
        setRecipe({
          id: recipeId,
          fields: {
            name: "Poulet aux légumes méditerranéens",
            description:
              "Un délicieux plat méditerranéen avec du poulet tendre et des légumes de saison, parfait pour un repas équilibré et savoureux.",
            ingredients:
              "Poulet (500g), Courgettes (2), Tomates (3), Poivrons (2), Oignon (1), Ail (3 gousses), Huile d'olive, Herbes de Provence, Sel, Poivre",
            nb_personnes: 4,
            intoleranceAlimentaire: "Sans gluten",
            calories: "320",
            proteines: "28g",
            glucides: "12g",
            lipides: "18g",
            vitamines: "A, C, E",
            mineraux: "Fer, Magnésium",
            image: "/placeholder.svg?height=300&width=400",
          },
        });
        setLoading(false);
      }, 1000);
    } else {
      setRecipe(null);
    }
  }, [recipeId]);

  const nutritionData = [
    {
      label: "Calories",
      value: recipe?.fields.calories,
      icon: Flame,
      color: "text-red-500",
    },
    {
      label: "Protéines",
      value: recipe?.fields.proteines,
      icon: ChefHat,
      color: "text-blue-500",
    },
    {
      label: "Glucides",
      value: recipe?.fields.glucides,
      icon: ChefHat,
      color: "text-green-500",
    },
    {
      label: "Lipides",
      value: recipe?.fields.lipides,
      icon: ChefHat,
      color: "text-yellow-500",
    },
  ];

  return (
    <Sheet open={!!recipeId} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col p-0 bg-gradient-to-br from-orange-50 via-white to-red-50"
      >
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">
                Chargement de la recette...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center bg-red-50 p-8 rounded-2xl border-2 border-red-200">
              <div className="text-4xl mb-4">😞</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Oups ! Une erreur est survenue
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {recipe && !loading && !error && (
          <>
            {/* Header with image */}
            <div className="relative h-64 bg-gradient-to-br from-orange-200 to-red-200">
              {recipe.fields.image ? (
                <img
                  src={recipe.fields.image || "/placeholder.svg"}
                  alt={recipe.fields.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ChefHat className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">Pas d'image disponible</p>
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      isBookmarked
                        ? "fill-blue-500 text-blue-500"
                        : "text-gray-600"
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </Button>
              </div>

              {/* Rating */}
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">4.8</span>
                </div>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {recipe.fields.name}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {recipe.fields.nb_personnes} personnes
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">30 min</span>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Description */}
                {recipe.fields.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {recipe.fields.description}
                    </p>
                  </div>
                )}

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {nutritionData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm font-medium text-gray-600">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        {item.value || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-orange-500" />
                    Ingrédients
                  </h3>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-gray-700 leading-relaxed">
                      {recipe.fields.ingredients}
                    </p>
                  </div>
                </div>

                {/* Dietary Info */}
                {recipe.fields.intoleranceAlimentaire && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Informations diététiques
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        {recipe.fields.intoleranceAlimentaire}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 border-blue-200"
                      >
                        Équilibré
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 border-purple-200"
                      >
                        Méditerranéen
                      </Badge>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Nutrition Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Valeurs nutritionnelles
                  </h3>
                  <div className="space-y-3">
                    {recipe.fields.vitamines && (
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2">
                          Vitamines
                        </h4>
                        <p className="text-yellow-700 text-sm">
                          {recipe.fields.vitamines}
                        </p>
                      </div>
                    )}
                    {recipe.fields.mineraux && (
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">
                          Minéraux
                        </h4>
                        <p className="text-blue-700 text-sm">
                          {recipe.fields.mineraux}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl py-3">
                    Commencer à cuisiner
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-300 hover:bg-gray-50 rounded-xl py-3 bg-transparent"
                  >
                    Ajouter à ma liste
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
