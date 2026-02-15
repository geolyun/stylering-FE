"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function AuthHeader({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between gap-2 rounded-card border border-gray-200 bg-gray-50 px-3 py-2">
      <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {user?.email ? <span>{user.email}</span> : <span>Not signed in</span>}
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
