"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { RatingStars } from "@/components/recipes/RatingStars";

type Recipe = {
  id: string;
  title: string;
  description?: string | null;
  ingredients: string;
  instructions: string;
  cuisine?: string | null;
  createdAt: string;
  authorId?: string | null;
  createdById?: string | null;
  imageUrl?: string | null;
};

type RatingSummary = {
  average: number | null;
  count: number;
  userRating?: number;
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | undefined>();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    apiFetch<Recipe>(`/recipes/${id}`)
      .then((data) => setRecipe(data))
      .catch((err: any) => setError(err.message || "Failed to load recipe"))
      .finally(() => setLoading(false));

    apiFetch<RatingSummary>(`/ratings/recipe/${id}`)
      .then((data) => {
        setAverageRating(data.average);
        setRatingsCount(data.count);
        if (typeof data.userRating === "number") {
          setUserRating(data.userRating);
        }
      })
      .catch(() => {
    
      });
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this recipe? This cannot be undone.")) return;

    setDeleting(true);
    setError(null);

    try {
      await apiFetch(`/recipes/${id}`, { method: "DELETE" });
      router.push("/recipes");
    } catch (err: any) {
      setError(err.message || "Failed to delete recipe");
    } finally {
      setDeleting(false);
    }
  };

  const handleRate = async (value: number) => {
    if (!id) return;

    await apiFetch(`/ratings`, {
      method: "POST",
      body: JSON.stringify({ recipeId: id, rating: value }),
    });

    const data = await apiFetch<RatingSummary>(`/ratings/recipe/${id}`);
    setAverageRating(data.average);
    setRatingsCount(data.count);
    setUserRating(data.userRating);
  };

  if (loading) return <p className="p-6 text-slate-900">Loading recipe...</p>;
  if (error && !recipe) return <p className="p-6 text-red-600">{error}</p>;
  if (!recipe) return <p className="p-6 text-slate-900">Recipe not found.</p>;

  const ingredientsLines = recipe.ingredients
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const instructionLines = recipe.instructions
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const ownerId = recipe.authorId ?? recipe.createdById ?? null;
  const currentUserId = (user as any)?.id ?? (user as any)?.userId ?? null;
  const isOwner = !!ownerId && !!currentUserId && ownerId === currentUserId;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-slate-900">
      {/* Верхняя панель */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link
          href="/recipes"
          className="inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Back to recipes
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="inline-flex items-center border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50"
            >
              Edit recipe
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center border border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* HERO-карточка */}
      <div className="border border-amber-100 bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50 px-6 py-7 shadow-xl sm:px-10 sm:py-9">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* Левая колонка */}
          <div className="flex-1 min-w-[280px] max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                Recipe details
              </p>
              {isOwner && (
                <span className="bg-emerald-600/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  My recipe
                </span>
              )}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {recipe.title}
            </h1>

            <p className="text-sm text-slate-600">
              {new Date(recipe.createdAt).toLocaleDateString("uk-UA")}
              {recipe.cuisine ? ` • ${recipe.cuisine}` : ""}
            </p>

            {recipe.description && (
              <p className="text-sm leading-relaxed text-slate-700">
                {recipe.description}
              </p>
            )}

            {/* Фото рецепта / плейсхолдер */}
            <div className="mt-4">
              {recipe.imageUrl ? (
                <div className="overflow-hidden border border-amber-100 bg-white/60 shadow-sm max-w-md">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-56 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-40 max-w-md items-center justify-center border border-dashed border-amber-200 bg-amber-50/40 text-xs text-amber-800">
                  No photo for this recipe yet
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка — рейтинг */}
          <div className="w-full md:w-[360px] bg-white/80 p-5 shadow-md backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
              Rating
            </p>

            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              What do you think?
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Rate this recipe from 1 to 5 stars.
            </p>

            <div className="mt-4">
              <RatingStars
                initialRating={userRating}
                averageRating={averageRating ?? null}
                ratingsCount={ratingsCount}
                onRate={handleRate}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-50 px-3 py-2">
                <p className="font-semibold text-emerald-800">Average</p>
                <p className="mt-1 text-sm text-emerald-900">
                  {averageRating ? averageRating.toFixed(1) : "—"} / 5
                </p>
              </div>
              <div className="bg-amber-50 px-3 py-2">
                <p className="font-semibold text-amber-800">Total ratings</p>
                <p className="mt-1 text-sm text-amber-900">
                  {ratingsCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Ингредиенты + инструкции */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
            Ingredients
          </h2>
          <p className="mb-3 text-base font-semibold text-slate-900">
            What you&apos;ll need
          </p>

          {ingredientsLines.length === 0 ? (
            <p className="text-sm text-slate-500">No ingredients specified.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed text-slate-800">
              {ingredientsLines.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
            Instructions
          </h2>
          <p className="mb-3 text-base font-semibold text-slate-900">
            Step-by-step guide
          </p>

          {instructionLines.length === 0 ? (
            <p className="text-sm text-slate-500">
              No instructions provided yet.
            </p>
          ) : (
            <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-slate-800">
              {instructionLines.length > 1 ? (
                instructionLines.map((line, idx) => <li key={idx}>{line}</li>)
              ) : (
                <li>{instructionLines[0]}</li>
              )}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
