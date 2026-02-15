"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

function resolveNextPath() {
  if (typeof window === "undefined") {
    return "/chat";
  }
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/chat";
}

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(resolveNextPath());
    }
  }, [loading, user, router]);

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await loginWithGoogle();
      router.replace(resolveNextPath());
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl items-center justify-center p-3 text-sm">
      <section className="w-full max-w-md rounded-card border border-gray-200 bg-white p-6">
        <h1 className="text-base font-semibold text-gray-900">Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in with Google to continue to StyleRing chat.
        </p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || submitting}
          className="mt-4 w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? "Signing in..." : "Continue with Google"}
        </button>
        {error ? <p className="mt-3 text-sm text-gray-700">{error}</p> : null}
      </section>
    </main>
  );
}
