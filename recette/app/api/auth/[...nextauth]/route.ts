import { getUserByEmail } from "@/lib/api";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await getUserByEmail(credentials?.email as string);

                if (user.length === 0) {
                    throw new Error("E-mail ou mot de passe invalide");
                }
                const userData = user[0].fields as {
                    firstname: string;
                    lastname: string;
                    email: string;
                    password: string;
                    name: string;
                };

                const isValidPassword = await bcrypt.compare(
                    credentials?.password as string,
                    userData.password as string
                );
                if (!isValidPassword) {
                    throw new Error("E-mail ou mot de passe invalide");
                }

                return { id: user[0].id, email: userData.email, name: userData.name };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
