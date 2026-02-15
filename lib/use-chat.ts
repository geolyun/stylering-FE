"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import type {
  ChatApiResponse,
  ChatCta,
  ChatMessage,
  ChatNextAction,
  ChatRecommendation,
  CreateChatSessionResponse,
} from "@/lib/types";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hello. How can I help you today?",
  },
];

function pickString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : "";
}

function resolveSessionId(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const value = payload as Record<string, unknown>;
  if (typeof value.sessionId === "string" || typeof value.sessionId === "number") {
    return value.sessionId;
  }
  const data = value.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (typeof nested.sessionId === "string" || typeof nested.sessionId === "number") {
      return nested.sessionId;
    }
  }
  return null;
}

function normalizeRecommendations(payload: unknown): ChatRecommendation[] | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const root = payload as Record<string, unknown>;
  const candidates = [root.recommendations, root.recommendation, (root.data as Record<string, unknown> | undefined)?.recommendations];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const parsed = candidate
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }
          const rec = item as Record<string, unknown>;
          if (
            typeof rec.title === "string" &&
            typeof rec.category === "string" &&
            typeof rec.reason === "string"
          ) {
            return {
              title: rec.title,
              category: rec.category,
              reason: rec.reason,
            };
          }
          return null;
        })
        .filter((item): item is ChatRecommendation => Boolean(item));
      if (parsed.length > 0) {
        return parsed;
      }
    }
  }

  const single = root.recommendation;
  if (single && typeof single === "object") {
    const rec = single as Record<string, unknown>;
    if (
      typeof rec.title === "string" &&
      typeof rec.category === "string" &&
      typeof rec.reason === "string"
    ) {
      return [
        {
          title: rec.title,
          category: rec.category,
          reason: rec.reason,
        },
      ];
    }
  }
  return undefined;
}

function normalizeCta(payload: unknown): ChatCta | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const root = payload as Record<string, unknown>;
  const raw = root.cta ?? (root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).cta : undefined);
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  const cta = raw as Record<string, unknown>;
  const toItem = (value: unknown) => {
    if (typeof value === "string") {
      return { label: value, action: value };
    }
    if (value && typeof value === "object") {
      const item = value as Record<string, unknown>;
      return {
        label: pickString(item.label) || undefined,
        action: pickString(item.action) || undefined,
      };
    }
    return undefined;
  };
  return {
    primary: toItem(cta.primary),
    secondary: toItem(cta.secondary),
  };
}

function normalizeNextAction(payload: unknown): ChatNextAction | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const root = payload as Record<string, unknown>;
  const candidate =
    pickString(root.nextAction) ||
    (root.data && typeof root.data === "object"
      ? pickString((root.data as Record<string, unknown>).nextAction)
      : "");
  if (candidate === "ASK" || candidate === "SUGGEST_STOP" || candidate === "RECOMMEND") {
    return candidate;
  }
  return undefined;
}

function normalizeAssistantContent(payload: unknown) {
  if (typeof payload === "string") {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return "";
  }
  const root = payload as Record<string, unknown>;
  const direct =
    pickString(root.assistantContent) ||
    pickString(root.content) ||
    pickString(root.message) ||
    pickString(root.text);
  if (direct) {
    return direct;
  }
  const data = root.data;
  if (!data || typeof data !== "object") {
    return "";
  }
  const nested = data as Record<string, unknown>;
  return (
    pickString(nested.assistantContent) ||
    pickString(nested.content) ||
    pickString(nested.message) ||
    pickString(nested.text)
  );
}

function normalizeApiResponse(payload: unknown): ChatApiResponse {
  const content = normalizeAssistantContent(payload) || "Empty response message.";
  const nextAction = normalizeNextAction(payload) ?? "ASK";
  const recommendations = normalizeRecommendations(payload);
  const cta = normalizeCta(payload);
  let sessionStatus = "ACTIVE";
  if (payload && typeof payload === "object") {
    const root = payload as Record<string, unknown>;
    sessionStatus =
      pickString(root.sessionStatus) ||
      (root.data && typeof root.data === "object"
        ? pickString((root.data as Record<string, unknown>).sessionStatus)
        : "") ||
      "ACTIVE";
  }

  let assistantMessageId: number | string | undefined;
  if (payload && typeof payload === "object") {
    const root = payload as Record<string, unknown>;
    if (typeof root.assistantMessageId === "number" || typeof root.assistantMessageId === "string") {
      assistantMessageId = root.assistantMessageId;
    }
  }

  return {
    assistantContent: content,
    nextAction,
    sessionStatus,
    recommendations,
    cta,
    assistantMessageId,
  };
}

export function useChat() {
  const showDebug = process.env.NEXT_PUBLIC_CHAT_DEBUG === "true";
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [sessionId, setSessionId] = useState<string | number | null>(null);
  const [input, setInput] = useState("");
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const createSession = useCallback(async () => {
    try {
      setIsSessionLoading(true);
      setError(null);
      setDebugInfo(null);
      const response = await apiFetch<CreateChatSessionResponse>("/api/v1/chat/sessions", {
        method: "POST",
      });
      const nextSessionId = resolveSessionId(response);
      if (!nextSessionId) {
        throw new Error("sessionId is missing in API response.");
      }
      setSessionId(nextSessionId);
      return nextSessionId;
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setRateLimitMessage("Too many requests. Please try again in a moment.");
      } else if (err instanceof ApiError) {
        setError(`Session request failed (${err.status}).`);
        setDebugInfo(
          `status=${err.status} | method=${err.method} | path=${err.path} | message=${err.details || err.message}`,
        );
      } else {
        setError(err instanceof Error ? err.message : "Session request failed.");
      }
      return null;
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    void createSession();
  }, [createSession]);

  const sendMessage = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || isTyping || isSessionLoading) {
        return;
      }

      let activeSessionId = sessionId;
      if (!activeSessionId) {
        activeSessionId = await createSession();
        if (!activeSessionId) {
          return;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `u-${Date.now()}`,
          role: "user",
          content: message,
        },
      ]);
      setInput("");
      setIsTyping(true);
      setError(null);
      setRateLimitMessage(null);
      setDebugInfo(null);

      try {
        const raw = await apiFetch<unknown>("/api/v1/chat/messages", {
          method: "POST",
          body: {
            sessionId: activeSessionId,
            message,
            content: message,
          },
        });
        const parsed = normalizeApiResponse(raw);
        setMessages((prev) => [
          ...prev,
          {
            id: parsed.assistantMessageId ? String(parsed.assistantMessageId) : `a-${Date.now()}`,
            role: "assistant",
            content: parsed.assistantContent,
            nextAction: parsed.nextAction,
            sessionStatus: parsed.sessionStatus,
            recommendations: parsed.recommendations,
            cta: parsed.cta,
          },
        ]);
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          setRateLimitMessage("Too many requests. Please try again in a moment.");
        } else if (err instanceof ApiError) {
          setError(`Message request failed (${err.status}).`);
          setDebugInfo(
            `status=${err.status} | method=${err.method} | path=${err.path} | message=${err.details || err.message}`,
          );
        } else {
          setError("Message request failed.");
        }
      } finally {
        setIsTyping(false);
      }
    },
    [createSession, isSessionLoading, isTyping, sessionId],
  );

  return {
    showDebug,
    messages,
    input,
    setInput,
    isSessionLoading,
    isTyping,
    error,
    rateLimitMessage,
    debugInfo,
    createSession,
    sendMessage,
  };
}
