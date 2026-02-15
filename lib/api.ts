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
  path: string;
  method: RequestMethod;
  details: string;

  constructor(status: number, message: string, path: string, method: RequestMethod) {
    super(message);
    this.status = status;
    this.path = path;
    this.method = method;
    this.details = message;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  const url = `${API_BASE_URL}${path}`;
  const isJsonBody = options.body !== undefined;

  const response = await fetch(url, {
    method,
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
    throw new ApiError(401, "Unauthorized", path, method);
  }

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    const text = await response.text();
    throw new ApiError(response.status, text || fallback, path, method);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text as T;
  }

  return (await response.json()) as T;
}
