"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {registerSchema, RegisterSchema} from "@/schemas/authSchema";

export default function RegisterPage() {
    const router = useRouter();
    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        mutate: register,
        isPending,
        error,
    } = useMutation<{ message: string; user: string }, Error, RegisterSchema>({
        mutationFn: async (data: RegisterSchema) => {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to create user");
            }
            return result;
        },
        onSuccess: (data) => {
            console.log("Registration successful", data);
            router.push("/login");
        },
    });

    function onSubmit(data: RegisterSchema) {
        register(data);
    }

    return (
        <div className="mx-auto h-full w-lg flex flex-col justify-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Inscription</CardTitle>
                    <CardDescription>
                        Créez un compte pour accéder à votre tableau de bord.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Votre nom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Votre nom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmation de mot de passe</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit" disabled={isPending}>
                                {isPending ? "Inscription en cours..." : "S'inscrire"}
                            </Button>
                            {error && <p className="text-red-500">{error.message}</p>}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
