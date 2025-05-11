import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/logo.jpg"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="object-contain"
                    />
                    <span className="text-xl font-semibold text-gray-800">
            Mon Recettier
          </span>
                </Link>

                <div className="flex items-center space-x-6">
                    <Link
                        href="/recette"
                        className="text-gray-700 hover:text-gray-900 transition"
                    >
                        Recettes
                    </Link>
                    <Link
                        href="/register"
                        className="text-gray-700 hover:text-gray-900 transition"
                    >
                        S'inscrire
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        </nav>
    );
}
