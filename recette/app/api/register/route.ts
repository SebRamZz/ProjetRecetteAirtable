import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, register } from "@/lib/api";

export async function POST(req: Request) {
    const { firstname, lastname, email, password } = await req.json();

    // Validation basique
    if (!firstname || !lastname || !email || !password) {
        return NextResponse.json(
            { message: "Veuillez remplir tous les champs requis !" },
            { status: 400 }
        );
    }

    // Vérifier si l'email existe déjà
    const users = await getUserByEmail(email);
    if (users.length > 0) {
        return NextResponse.json(
            { message: "Cet e-mail existe déjà." },
            { status: 400 }
        );
    }

    try {
        // Hash du mot de passe
        const passwordHash = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const createdUser = await register({
            firstname,
            lastname,
            email,
            password: passwordHash,
        });

        return NextResponse.json(
            {
                message: "Inscription réussie !",
                user: createdUser,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json(
            { message: "Impossible de créer l’utilisateur." },
            { status: 500 }
        );
    }
}
