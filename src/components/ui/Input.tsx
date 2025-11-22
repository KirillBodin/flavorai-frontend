"use client";

import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...rest }: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...rest}
        className={clsx(
          "block w-full rounded-md border px-3 py-2 text-sm shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
