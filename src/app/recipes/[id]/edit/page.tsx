"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Recipe = {
  id: string;
  title: string;
  description?: string | null;
  ingredients: string;
  instructions: string;
  cuisine?: string | null;
  authorId?: string;
  imageUrl?: string | null;
};

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setForbidden(false);

    apiFetch<Recipe>(`/recipes/${id}`)
      .then((data) => {
      
        if (user && data.authorId && data.authorId !== user.id) {
          setForbidden(true);
          return;
        }

        setRecipe(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setIngredients(data.ingredients);
        setInstructions(data.instructions);
        setCuisine(data.cuisine ?? "");

        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      })
      .catch((err: any) => setError(err.message || "Failed to load recipe"))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
 
      if (recipe?.imageUrl) {
        setImagePreview(recipe.imageUrl);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);

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

      await apiFetch(`/recipes/${id}`, {
        method: "PATCH",
        body: formData, 
      });

      router.push(`/recipes/${id}`);
    } catch (err: any) {
      setError(err.message || "Failed to update recipe");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-slate-900">
        <p className="text-sm text-slate-700">Loading recipe...</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-slate-900">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          You can only edit recipes that you created.
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-slate-900">
        <p className="text-sm text-slate-700">Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-slate-900">
      {/* заголовок в том же стиле, что и All recipes */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit recipe
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Update the details of your recipe. Changes will be visible in the
            list and on the recipe page.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>

      {/* форма в виде карточки, как остальные блоки */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm space-y-5"
      >
        {error && (
          <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Блок с превью фото (как в CreateRecipePage) */}
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
            JPEG or PNG, preferably up to 5&nbsp;MB.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-slate-500">
            One ingredient per line, e.g. &quot;2 eggs&quot;, &quot;200g
            flour&quot;.
          </p>
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <p className="text-xs text-slate-500">
            You can use multiple lines — each line will be a separate step.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800">
            Cuisine (optional)
          </label>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
