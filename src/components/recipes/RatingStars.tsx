"use client";

import { useState } from "react";
import clsx from "clsx";

type Props = {
  initialRating?: number;      
  averageRating?: number | null;
  ratingsCount?: number;
  onRate?: (value: number) => Promise<void> | void;
};

export function RatingStars({
  initialRating,
  averageRating,
  ratingsCount,
  onRate,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const [current, setCurrent] = useState(initialRating ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (value: number) => {
    if (!onRate || loading) return;
    setLoading(true);
    setError(null);
    try {
      await onRate(value);
      setCurrent(value);
    } catch (err: any) {
      setError(err.message || "Failed to rate");
    } finally {
      setLoading(false);
    }
  };

  const display = hover ?? current;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              className="p-0.5"
              onMouseEnter={() => setHover(v)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleClick(v)}
            >
              <span
                className={clsx(
                  "text-xl transition-colors",
                  display >= v ? "text-yellow-400" : "text-slate-300"
                )}
              >
                ★
              </span>
            </button>
          ))}
        </div>
        {averageRating != null && (
          <span className="text-xs text-slate-600">
            {averageRating.toFixed(1)} / 5
            {typeof ratingsCount === "number" && ratingsCount > 0
              ? ` (${ratingsCount})`
              : ""}
          </span>
        )}
      </div>
      {loading && (
        <p className="text-xs text-slate-500">Saving your rating...</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
