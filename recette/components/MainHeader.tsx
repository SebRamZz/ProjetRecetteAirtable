"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Sparkles, User, UtensilsCrossed } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

interface MainHeaderProps {
  onOpenAiSheet: () => void;
}

export function MainHeader({ onOpenAiSheet }: MainHeaderProps) {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Recettiers
            </span>
            <div className="text-xs text-gray-500 -mt-1">Powered by AI</div>
          </div>
        </Link>

        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <Button
              onClick={onOpenAiSheet}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Créer avec l'IA
            </Button>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-medium bg-white/80"
            >
              Déconnexion
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-semibold bg-white/80"
              >
                <User className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                S'inscrire
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
