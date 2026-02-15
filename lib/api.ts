"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  const url = `${API_BASE_URL}${path}`;
  const isJsonBody = options.body !== undefined;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: isJsonBody ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (response.status === 401) {
    if (auth) {
      await signOut(auth);
    }
    throw new ApiError(401, "Unauthorized");
  }

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    const text = await response.text();
    throw new ApiError(response.status, text || fallback);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
