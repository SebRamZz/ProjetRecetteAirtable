"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Users } from "lucide-react";
import Image from "next/image";

interface RecipeCardProps {
  recipe: {
    id: string;
    fields: {
      name: string;
      description?: string;
      nb_personnes?: number;
      image?: string;
      images?: { url: string; alt?: string }[];
    };
  };
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const imageUrl = recipe.fields.image || recipe.fields.images?.[0]?.url;
  const altText = recipe.fields.name || "Image de recette";

  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0"
      onClick={onClick}
    >
      <div className="relative w-full h-56 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={altText}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-6xl mb-2">🍽️</div>
            <span className="text-sm font-medium">Pas d'image</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">4.8</span>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {recipe.fields.name}
        </h3>

        {recipe.fields.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {recipe.fields.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.fields.nb_personnes ?? "?"} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>30 min</span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 rounded-xl font-semibold text-sm">
            Voir la recette
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
