"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const linkClass = (path: string) =>
    clsx(
      "text-sm font-medium px-3 py-2 rounded-md",
      pathname === path
        ? "bg-emerald-100 text-emerald-800"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    );

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold text-emerald-700">
            FlavorAI
          </Link>
          <div className="hidden gap-2 md:flex">
            <Link href="/recipes" className={linkClass("/recipes")}>
              All Recipes
            </Link>
            <Link href="/my-recipes" className={linkClass("/my-recipes")}>
              My Recipes
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-gray-700 sm:inline">
                {user.email}
              </span>
              <Button onClick={handleLogout} className="px-3 py-1 text-xs sm:text-sm">
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link href="/register" className={linkClass("/register")}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
