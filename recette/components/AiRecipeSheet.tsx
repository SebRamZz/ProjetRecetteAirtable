"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ChefHat, Clock, Loader2, Save, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUploadDialog } from "./ImageUploadDialog";

interface AIRecipeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeSaved: (recipe: any) => void;
}

export function AIRecipeSheet({
  open,
  onOpenChange,
  onRecipeSaved,
}: AIRecipeSheetProps) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { register, handleSubmit, reset } = useForm();

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
      repaired = repaired.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
      repaired = repaired.replace(/,(\s*[}\]])/g, "$1");
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
    setSaveStatus(null);
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
          setAiError(
            "Impossible d'extraire un objet JSON de la réponse de l'IA. Réponse brute :\n" +
              json.response
          );
        } else {
          try {
            recipe = JSON.parse(rawJson);
          } catch (e: any) {
            const repairedJson = attemptJsonRepair(rawJson);
            if (repairedJson) {
              try {
                recipe = JSON.parse(repairedJson);
              } catch (e2: any) {
                setAiError(
                  "Erreur de syntaxe JSON même après réparation : " +
                    e2.message +
                    "\nRéponse brute :\n" +
                    rawJson
                );
                console.error("AI raw JSON (repair failed):", rawJson);
              }
            } else {
              setAiError(
                "Erreur de syntaxe JSON : " +
                  e.message +
                  "\nRéponse brute :\n" +
                  rawJson
              );
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

  const saveToAirtable = async (recipe: any, imgUrl: string) => {
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
      if (imgUrl) {
        body.images = [{ url: imgUrl }];
      }

      const res = await fetch("/api/recette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaveStatus({
          success: true,
          message: "Recette sauvegardée avec succès !",
        });
        onRecipeSaved(recipe);
      } else {
        const error = await res.json();
        setSaveStatus({
          success: false,
          message: error.error || "Erreur lors de la sauvegarde",
        });
      }
    } catch (e: any) {
      setSaveStatus({
        success: false,
        message: e.message || "Erreur lors de la sauvegarde",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSheet = () => {
    onOpenChange(false);
    setAiResult(null);
    setAiError(null);
    setSaveStatus(null);
    setImageUrl("");
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col bg-gradient-to-br from-orange-50 to-red-50 border-l-0"
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-orange-500" />
            Créer une recette avec l'IA
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {!aiResult && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="ingredients"
                    className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                  >
                    <ChefHat className="h-5 w-5 text-orange-500" />
                    Ingrédients disponibles
                  </Label>
                  <Textarea
                    id="ingredients"
                    {...register("ingredients", { required: true })}
                    placeholder="Ex: tomates, poulet, riz, oignons, ail..."
                    className="min-h-[100px] rounded-xl border-2 border-gray-200 focus:border-orange-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nb_personnes"
                      className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <Users className="h-5 w-5 text-orange-500" />
                      Personnes
                    </Label>
                    <Input
                      id="nb_personnes"
                      type="number"
                      min={1}
                      {...register("nb_personnes", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      placeholder="4"
                      className="rounded-xl border-2 border-gray-200 focus:border-orange-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="intolerances"
                      className="text-lg font-semibold text-gray-800"
                    >
                      Intolérances
                    </Label>
                    <Input
                      id="intolerances"
                      {...register("intolerances")}
                      placeholder="gluten, lactose..."
                      className="rounded-xl border-2 border-gray-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Générer la recette
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {aiLoading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
              <div className="animate-pulse">
                <Sparkles className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Création en cours...
                </h3>
                <p className="text-gray-600">
                  L'IA prépare votre recette personnalisée
                </p>
              </div>
            </div>
          )}

          {aiError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="text-red-800">
                <h3 className="font-semibold text-lg mb-2">
                  Oops ! Une erreur est survenue
                </h3>
                <p className="text-sm mb-4">
                  Veuillez réessayer la génération de votre recette.
                </p>
                <details className="text-xs bg-red-100 p-3 rounded-lg">
                  <summary className="cursor-pointer font-medium">
                    Détails techniques
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap">{aiError}</pre>
                </details>
              </div>
            </div>
          )}

          {aiResult && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{aiResult.name}</h3>
                <p className="opacity-90">{aiResult.description}</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-orange-50 rounded-xl p-4">
                    <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">
                      {aiResult.nb_personnes}
                    </div>
                    <div className="text-sm text-gray-600">Personnes</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <Clock className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">30</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <ChefHat className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">
                      {aiResult.calories}
                    </div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Ingrédients
                    </h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                      {aiResult.ingredients}
                    </p>
                  </div>

                  {aiResult.intoleranceAlimentaire && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Intolérances prises en compte
                      </h4>
                      <p className="text-gray-600 bg-yellow-50 p-4 rounded-xl">
                        {aiResult.intoleranceAlimentaire}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setShowImageModal(true)}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Sauvegarder la recette
                    </>
                  )}
                </Button>

                {saveStatus && (
                  <div
                    className={`p-4 rounded-xl text-center font-medium ${
                      saveStatus.success
                        ? "bg-green-50 text-green-800 border-2 border-green-200"
                        : "bg-red-50 text-red-800 border-2 border-red-200"
                    }`}
                  >
                    {saveStatus.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleCloseSheet}
            className="w-full rounded-xl border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
          >
            Fermer
          </Button>
        </div>
      </SheetContent>

      <ImageUploadDialog
        open={showImageModal}
        onOpenChange={setShowImageModal}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        onSave={async () => {
          await saveToAirtable(aiResult, imageUrl);
          setShowImageModal(false);
          handleCloseSheet();
        }}
        saving={saving}
      />
    </Sheet>
  );
}
