"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  const primaryCta = user ? "/recipes" : "/register";
  const primaryText = user ? "Browse recipes" : "Get started";
  const secondaryCta = user ? "/my-recipes" : "/login";
  const secondaryText = user ? "My recipes" : "Login";

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-rose-50 to-emerald-50 shadow-lg">
        <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-12">
          {/* Text */}
          <div className="md:w-1/2 space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Your personal recipe assistant
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Welcome to <span className="text-emerald-700">FlavorAI</span>
            </h1>

            <p className="text-base md:text-lg text-slate-700 max-w-xl">
              Discover, create, and manage recipes that match your taste.
              Let AI help you pick what to cook next — even with the ingredients
              you already have at home.
            </p>

            {user && (
              <p className="text-sm text-slate-600">
                👋 Logged in as{" "}
                <span className="font-semibold">
                  {user.name || user.email}
                </span>
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={primaryCta}
                className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
              >
                {primaryText}
              </Link>

              <Link
                href={secondaryCta}
                className="inline-flex items-center rounded-full border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
              >
                {secondaryText}
              </Link>
            </div>
          </div>

          {/* Image / Illustration placeholder */}
          <div className="md:w-1/2">
            <div className="relative mx-auto h-56 w-full max-w-sm md:h-64">
              <div className="absolute inset-0 rounded-3xl bg-white/70 shadow-lg border border-amber-100 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-700 mb-1">
                    Today&apos;s suggestion
                  </p>
                  <h2 className="text-lg font-bold text-slate-900">
                    Creamy Garlic Pasta
                  </h2>
                  <p className="mt-2 text-xs text-slate-600">
                    Ready in 20 minutes • 7 ingredients
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-slate-700">
                  <div className="rounded-xl bg-emerald-50 px-2 py-2">
                    <p className="font-semibold">AI Picks</p>
                    <p className="text-[11px] text-slate-600">
                      Based on your saved recipes
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 px-2 py-2">
                    <p className="font-semibold">Pantry Match</p>
                    <p className="text-[11px] text-slate-600">
                      Use what you already have
                    </p>
                  </div>
                  <div className="rounded-xl bg-rose-50 px-2 py-2">
                    <p className="font-semibold">Rating</p>
                    <p className="text-[11px] text-yellow-600">⭐ 4.8 / 5</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
  <span>More ideas coming soon</span>
  <div className="flex gap-1">
    <span className="h-1.5 w-3 rounded-full bg-emerald-500" />
    <span className="h-1.5 w-3 rounded-full bg-emerald-200" />
    <span className="h-1.5 w-3 rounded-full bg-emerald-200" />
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Save your favorite recipes
          </h3>
          <p className="text-sm text-slate-600">
            Add your own recipes with ingredients and detailed instructions.
            Access them anytime from any device.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Smart search
          </h3>
          <p className="text-sm text-slate-600">
            Quickly find recipes by name and later — by ingredients or cuisine
            type for even more precise suggestions.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Personal ratings
          </h3>
          <p className="text-sm text-slate-600">
            Rate recipes from 1 to 5 stars and see which dishes become your
            all-time favorites.
          </p>
        </div>
      </section>
    </div>
  );
}
