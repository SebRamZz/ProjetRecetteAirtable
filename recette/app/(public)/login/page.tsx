"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {loginSchema, LoginSchema} from "@/schemas/authSchema";

export default function LoginPage() {
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const router = useRouter();

    const {
        mutate: login,
        error,
        isError,
        isPending,
    } = useMutation<SignInResponse, Error, LoginSchema>({
        mutationFn: async (data: LoginSchema) => {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
                callbackUrl: "/",
            });
            if (!result || result.error) {
                throw new Error(result?.error || "Echec de la connexion");
            }
            return result as SignInResponse;
        },
        mutationKey: ["login"],
        onSuccess: (response) => {
            if (response.url) router.push(response.url);
        },
    });

    function onSubmit(values: LoginSchema) {
        login(values);
    }
    return (
        <div className="mx-auto h-full w-lg flex flex-col justify-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Connexion</CardTitle>
                    <CardDescription>
                        Veuillez entrer votre adresse e-mail et votre mot de passe pour vous
                        connecter.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {isError && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        Email ou mot de passe incorrect.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse e-mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="exemple@mail.fr"
                                                type="text"
                                                {...field}
                                            />
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
                            <Button type="submit" className="w-full">
                                {isPending ? "Connexion en cours..." : "Connexion"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
