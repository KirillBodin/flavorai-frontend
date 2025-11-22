"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

type Recipe = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<Recipe[]>("/recipes/mine")
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-slate-900">
      {/* Заголовок + кнопка */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My recipes
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Here are all recipes you&apos;ve created. You can open them to view,
            edit or rate.
          </p>
        </div>

        <div className="flex justify-start md:justify-end">
          <Link
            href="/recipes/create"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            + Add recipe
          </Link>
        </div>
      </div>

      {/* Контент */}
      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-700">Loading your recipes...</p>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-800">
              You don&apos;t have any recipes yet
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Start by adding your first recipe — it will appear here.
            </p>
            <Link
              href="/recipes/create"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add your first recipe
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h2 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
                    {recipe.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                    My recipe
                  </span>
                </div>

                {recipe.description && (
                  <p className="line-clamp-3 text-sm text-slate-700">
                    {recipe.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    View details
                    <span aria-hidden>›</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
