"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Recipe = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  imageUrl?: string | null;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = query ? `?search=${encodeURIComponent(query)}` : "";
    apiFetch<Recipe[]>(`/recipes${q}`)
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search.trim());
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-slate-900">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            All recipes
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Discover all recipes and use the search to find something tasty.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:w-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 md:w-80"
          >
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white md:inline-flex md:items-center hover:bg-emerald-700"
            >
              Search
            </button>
          </form>

          <div className="flex justify-end">
            <Link
              href="/recipes/create"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              + Add recipe
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-slate-700">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center">
            <p className="text-base font-medium text-slate-800">
              No recipes found
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Try a different search or create your first recipe.
            </p>
            <Link
              href="/recipes/create"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add your first recipe
            </Link>
          </div>
        ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
          
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
      <Link
        href={`/recipes/${recipe.id}`}
        className="
          group flex flex-col overflow-hidden 
          rounded-xl border border-slate-200 bg-white 
          shadow-sm hover:shadow-md hover:-translate-y-0.5 
          transition-all
        "
      >
        {/* IMAGE */}
        <div className="relative h-24 w-full overflow-hidden">
          <img
            src={recipe.imageUrl || '/no-image.png'}
            alt={recipe.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
          />
  
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
  
          <div className="absolute left-2 bottom-1 text-white drop-shadow">
            <h2 className="text-xs font-semibold line-clamp-1">
              {recipe.title}
            </h2>
          </div>
        </div>
  
        {/* BODY */}
        <div className="p-3">
          <p className="line-clamp-1 text-[11px] text-slate-700 mb-1">
            {recipe.description || "No description."}
          </p>
  
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            View details <span aria-hidden>›</span>
          </div>
        </div>
      </Link>
    );
  }
  