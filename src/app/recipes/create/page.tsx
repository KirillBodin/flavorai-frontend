"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreateRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      formData.append("cuisine", cuisine);
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      const created = await apiFetch<{ id: string }>("/recipes", {
        method: "POST",
        body: formData,          
      });
  
      router.push(`/recipes/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center px-4 py-10 text-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">
          Add new recipe
        </h1>
        <p className="text-sm text-slate-700 mb-2">
          Fill in the details of your recipe. You&apos;ll be able to edit it
          later.
        </p>

        {error && (
          <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Блок с превью фото */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">
            Recipe photo (optional)
          </label>

          {imagePreview && (
            <div className="flex justify-center">
              <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-900
              file:mr-3 file:rounded-full file:border-0
              file:bg-emerald-50 file:px-4 file:py-2
              file:text-sm file:font-semibold file:text-emerald-700
              hover:file:bg-emerald-100"
          />
          <p className="text-xs text-slate-500">
            JPEG или PNG.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800">
            Short description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder='Optional, e.g. "Quick weeknight pasta"'
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800">
            Ingredients
          </label>
          <textarea
            required
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={5}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder={"One ingredient per line:\nPasta\nGarlic\nOlive oil\nSalt\nPepper"}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800">
            Instructions
          </label>
          <textarea
            required
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Step-by-step instructions..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800">
            Cuisine (optional)
          </label>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g. Italian, Asian, Ukrainian..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
