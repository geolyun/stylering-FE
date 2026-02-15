"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthHeader } from "@/components/auth-header";
import { ApiError, apiFetch } from "@/lib/api";
import type { MeResponse } from "@/lib/types";

export function ProfileView() {
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMe() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<MeResponse>("/api/v1/me", {
          signal: controller.signal,
        });
        setProfile(data);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        if (err instanceof ApiError) {
          setError(err.message || `API error (${err.status})`);
          return;
        }
        setError("Failed to load profile.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchMe();
    return () => controller.abort();
  }, []);

  const createdAtText = useMemo(() => {
    if (!profile?.createdAt) {
      return "-";
    }
    const date = new Date(profile.createdAt);
    if (Number.isNaN(date.getTime())) {
      return profile.createdAt;
    }
    return date.toLocaleString();
  }, [profile]);

  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl bg-white p-3 text-sm text-gray-900">
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <AuthHeader title="Profile" />
        <div className="rounded-card border border-gray-200 bg-white p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading profile...</p>
          ) : null}

          {!loading && error ? (
            <div className="rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {error}
            </div>
          ) : null}

          {!loading && !error && profile ? (
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <dt className="text-gray-500">uid</dt>
                <dd className="break-all font-medium text-gray-900">{profile.uid}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-gray-500">createdAt</dt>
                <dd className="font-medium text-gray-900">{createdAtText}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </section>
    </main>
  );
}
