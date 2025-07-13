"use client";

import { useState, useEffect, useRef } from "react";
import { RecipeSidebar } from "./RecipeSidebar";
import { Recette } from "@/app/api/recette/route";
import { searchRecettes } from "@/lib/api";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function ClientRecetteList({ recettes: initialRecettes }: { recettes: Recette[] }) {
    const [query, setQuery] = useState("");
    const [recettes, setRecettes] = useState<Recette[]>(initialRecettes);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [aiError, setAiError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageUrlError, setImageUrlError] = useState<string>("");
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!query.trim()) {
                setRecettes(initialRecettes);
                return;
            }

            searchRecettes(query)
                .then(setRecettes)
                .catch(console.error);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    function extractJsonFromText(text: string) {
        text = text.replace(/```json|```/g, "");
        text = text.replace(/`/g, "");
        const first = text.indexOf("{");
        const last = text.lastIndexOf("}");
        if (first !== -1 && last !== -1) {
            return text.slice(first, last + 1);
        }
        return null;
    }

    function attemptJsonRepair(jsonString: string): string | null {
        try {
            JSON.parse(jsonString);
            return jsonString;
        } catch (e) {
            let repaired = jsonString;
  
            repaired = repaired.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1$2$3"');
            
            repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
            
            try {
                JSON.parse(repaired);
                return repaired;
            } catch (e2) {
                return null;
            }
        }
    }

    const onSubmit = async (data: any) => {
        setAiLoading(true);
        setAiResult(null);
        setAiError(null);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ingredients: data.ingredients,
                    nb_personnes: data.nb_personnes,
                    intolerances: data.intolerances,
                }),
            });
            const json = await res.json();
            let recipe = null;
            if (json && json.response) {
                const rawJson = extractJsonFromText(json.response);
                if (!rawJson) {
                    setAiError("Impossible d'extraire un objet JSON de la réponse de l'IA. Réponse brute :\n" + json.response);
                } else {
                    try {
                        recipe = JSON.parse(rawJson);
                    } catch (e: any) {
                        const repairedJson = attemptJsonRepair(rawJson);
                        if (repairedJson) {
                            try {
                                recipe = JSON.parse(repairedJson);
                            } catch (e2: any) {
                                setAiError("Erreur de syntaxe JSON même après réparation : " + e2.message + "\nRéponse brute :\n" + rawJson);
                                console.error("AI raw JSON (repair failed):", rawJson);
                            }
                        } else {
                            setAiError("Erreur de syntaxe JSON : " + e.message + "\nRéponse brute :\n" + rawJson);
                            console.error("AI raw JSON (parse error):", rawJson);
                        }
                    }
                }
            }
            setAiResult(recipe);
        } catch (e: any) {
            setAiError(e.message || "Erreur lors de la communication avec l'IA.");
        } finally {
            setAiLoading(false);
        }
    };

    const saveToAirtable = async (recipe: any, imageUrl: string) => {
        setSaving(true);
        setSaveStatus(null);
        try {
            const body: any = {
                name: recipe.name,
                description: recipe.description,
                ingredients: recipe.ingredients,
                nb_personnes: recipe.nb_personnes,
                intoleranceAlimentaire: recipe.intoleranceAlimentaire || "",
                calories: String(recipe.calories || ""),
                proteines: String(recipe.proteines || ""),
                glucides: String(recipe.glucides || ""),
                lipides: String(recipe.lipides || ""),
                vitamines: recipe.vitamines ? JSON.stringify(recipe.vitamines) : "",
                mineraux: recipe.mineraux ? JSON.stringify(recipe.mineraux) : "",
            };
            if (imageUrl) {
                body.images = [{ url: imageUrl }];
            }
            const res = await fetch("/api/recette", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            
            if (res.ok) {
                setSaveStatus({ success: true, message: "Recette sauvegardée avec succès !" });
                const updatedRecettes = await fetch("/api/recette").then(r => r.json());
                setRecettes(updatedRecettes);
            } else {
                const error = await res.json();
                setSaveStatus({ success: false, message: error.error || "Erreur lors de la sauvegarde" });
            }
        } catch (e: any) {
            setSaveStatus({ success: false, message: e.message || "Erreur lors de la sauvegarde" });
        } finally {
            setSaving(false);
        }
    };

    function renderRecipe(recipe: any) {
        if (!recipe) return null;
        return (
            <div className="mt-6 p-4 bg-gray-100 rounded overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {recipe.image && (
                    <div className="mb-4 flex justify-center">
                        <img src={recipe.image} alt={recipe.name} className="rounded max-h-48 object-cover" />
                    </div>
                )}
                <div className="mt-2">
                    <div><b>Nom :</b> {recipe.name}</div>
                    <div><b>Description :</b> {recipe.description}</div>
                    <div><b>Ingrédients :</b> {recipe.ingredients}</div>
                    <div><b>Nombre de personnes :</b> {recipe.nb_personnes}</div>
                    {recipe.images && Array.isArray(recipe.images) && recipe.images.length > 0 && (
                        <div>
                            <b>Images :</b>
                            {recipe.images.map((img: any, i: number) => (
                                <div key={i}>
                                    <a href={img.url || img} target="_blank" rel="noopener noreferrer">
                                        {img.url || img}
                                    </a>
                                    {img.alt && <span className="ml-2 text-xs text-gray-500">({img.alt})</span>}
                                </div>
                            ))}
                        </div>
                    )}
                    <div><b>Intolérances alimentaires :</b> {recipe.intoleranceAlimentaire ? recipe.intoleranceAlimentaire : "Aucune"}</div>
                    <div><b>Calories :</b> {recipe.calories}</div>
                    <div><b>Protéines :</b> {recipe.proteines}</div>
                    <div><b>Glucides :</b> {recipe.glucides}</div>
                    <div><b>Lipides :</b> {recipe.lipides}</div>
                    {recipe.vitamines && (
                        <div><b>Vitamines :</b> <pre className="inline whitespace-pre-wrap">{JSON.stringify(recipe.vitamines, null, 2)}</pre></div>
                    )}
                    {recipe.mineraux && (
                        <div><b>Minéraux :</b> <pre className="inline whitespace-pre-wrap">{JSON.stringify(recipe.mineraux, null, 2)}</pre></div>
                    )}
                </div>
                <div className="mt-4 flex gap-2">
                    <Button 
                        onClick={() => setShowImageModal(true)}
                        disabled={saving}
                        className="flex-1"
                    >
                        {saving ? "Sauvegarde..." : "Sauvegarder dans Airtable"}
                    </Button>
                </div>
                {saveStatus && (
                    <div className={`mt-2 p-2 rounded text-sm ${saveStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {saveStatus.message}
                    </div>
                )}
            </div>
        );
    }

    function isValidImageUrl(url: string) {
        return (
            typeof url === "string" &&
            url.startsWith("http") &&
            !url.startsWith("data:") &&
            /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)
        );
    }

    return (
        <>
            <div className="p-4 w-1/2 mx-auto flex flex-col items-center">
                <Input
                    placeholder="Rechercher une recette, un ingrédient ou un type de plat..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mb-6"
                />
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button className="mb-4" variant="default">Créer une recette avec l’IA</Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Créer une recette avec l’IA</SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                            <label>Ingrédients</label>
                            <Input {...register("ingredients", { required: true })} placeholder="Ex: tomates, poulet, riz..." />
                            <label>Nombre de personnes</label>
                            <Input type="number" min={1} {...register("nb_personnes", { required: true })} placeholder="Ex: 4" />
                            <label>Intolérances alimentaires</label>
                            <Input {...register("intolerances")} placeholder="Ex: gluten, lactose..." />
                            <Button type="submit" disabled={aiLoading}>{aiLoading ? "Génération..." : "Générer la recette"}</Button>
                        </form>
                        {aiLoading && (
                            <div className="mt-6 p-4 bg-gray-50 rounded text-sm text-gray-600">
                                Génération en cours...
                            </div>
                        )}
                        {aiError && (
                            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
                                <div className="font-semibold mb-2">Une erreur technique est survenue lors de la génération de la recette.</div>
                                <div className="mb-2">Détail :<br /><pre className="whitespace-pre-wrap text-xs">{aiError}</pre></div>
                                <div>Veuillez cliquer sur "Générer la recette" à nouveau pour réessayer.</div>
                            </div>
                        )}
                        {aiResult && renderRecipe(aiResult)}
                        <SheetFooter>
                            <Button variant="secondary" onClick={() => { 
                                setOpen(false); 
                                setAiResult(null); 
                                setAiError(null); 
                                setSaveStatus(null);
                                reset(); 
                            }}>Fermer</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 pb-6">
                {recettes.map((r) => (
                    <div
                        key={r.id}
                        className="cursor-pointer bg-white rounded-xl shadow overflow-hidden w-full"
                        onClick={() => setActiveId(r.id)}
                    >
                        {((r.fields as any).image || r.fields.images?.[0]?.url) && (
                            <img
                                src={(r.fields as any).image || r.fields.images?.[0]?.url}
                                alt={r.fields.name}
                                className="object-cover w-full h-44"
                                style={{ width: 360, height: 200 }}
                            />
                        )}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold line-clamp-2">
                                {r.fields.name}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Pour {r.fields.nb_personnes ?? "?"} personnes
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <RecipeSidebar
                recipeId={activeId}
                onClose={() => setActiveId(null)}
            />

            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => { setShowImageModal(false); setImageUrl(""); setImageUrlError(""); }}
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Ajouter un lien d'image à la recette (optionnel)</h2>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={imageUrl}
                            onChange={e => { setImageUrl(e.target.value); setImageUrlError(""); }}
                            className="mb-2 w-full border rounded px-3 py-2"
                        />
                        {imageUrl && !isValidImageUrl(imageUrl) && (
                            <div className="mb-2 text-red-600 text-sm">Le lien doit être une URL d'image valide (jpg, png, gif, webp, svg) et non un data URL.</div>
                        )}
                        {imageUrlError && (
                            <div className="mb-2 text-red-600 text-sm">{imageUrlError}</div>
                        )}
                        {imageUrl && isValidImageUrl(imageUrl) && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={imageUrl}
                                    alt="Aperçu"
                                    className="max-h-40 rounded shadow"
                                    onError={e => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
                        <Button
                            onClick={async () => {
                                if (imageUrl && !isValidImageUrl(imageUrl)) {
                                    setImageUrlError("Le lien doit être une URL d'image valide (jpg, png, gif, webp, svg) et non un data URL.");
                                    return;
                                }
                                setShowImageModal(false);
                                await saveToAirtable(aiResult, imageUrl);
                                setImageUrl("");
                                setImageUrlError("");
                            }}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Enregistrement..." : "Enregistrer la recette"}
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
