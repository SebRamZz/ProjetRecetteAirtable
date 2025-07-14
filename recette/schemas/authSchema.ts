import { z } from "zod";

export const registerSchema = z
    .object({
        firstname: z.string().min(3, "Prénom requis"),
        lastname: z.string().min(3, "Nom requis"),
        email: z.string().email("Email invalide"),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string().min(8, "Confirmation du mot de passe requise"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
    });
export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
