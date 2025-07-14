"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Link, Loader2 } from "lucide-react";
import { useState } from "react";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  imageUrl,
  onImageUrlChange,
  onSave,
  saving,
}: ImageUploadDialogProps) {
  const [imageUrlError, setImageUrlError] = useState<string>("");

  function isValidImageUrl(url: string) {
    return (
      typeof url === "string" &&
      url.startsWith("http") &&
      !url.startsWith("data:") &&
      /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)
    );
  }

  const handleSaveClick = async () => {
    if (imageUrl && !isValidImageUrl(imageUrl)) {
      setImageUrlError(
        "Le lien doit être une URL d'image valide (jpg, png, gif, webp, svg) et non un data URL."
      );
      return;
    }
    setImageUrlError("");
    await onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-blue-500" />
            Ajouter une image à votre recette
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label
              htmlFor="imageUrl"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Link className="h-4 w-4 text-blue-500" />
              URL de l'image (optionnel)
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => {
                onImageUrlChange(e.target.value);
                setImageUrlError("");
              }}
              className="rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-white/80"
            />
            {imageUrl && !isValidImageUrl(imageUrl) && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                ⚠️ Le lien doit être une URL d'image valide (jpg, png, gif,
                webp, svg)
              </p>
            )}
            {imageUrlError && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {imageUrlError}
              </p>
            )}
          </div>

          {imageUrl && isValidImageUrl(imageUrl) && (
            <div className="bg-white/80 p-4 rounded-xl border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Aperçu de l'image :
              </p>
              <div className="flex justify-center">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Aperçu"
                  className="max-h-40 rounded-lg shadow-md object-cover border-2 border-gray-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSaveClick}
            disabled={saving || (imageUrl && !isValidImageUrl(imageUrl))}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer la recette"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
