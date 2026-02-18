"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import type {
  ChatMessage,
  ChatNextAction,
  ChatSessionStatus,
  CreateChatSessionResponse,
  SendChatMessageResponse,
} from "@/lib/types";

/* ─── Constants ─── */

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "안녕하세요! 어떤 스타일을 찾고 계신가요?",
};

const STOP_COMMAND = "추천해줘";
const RATE_LIMIT_MSG = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";

/* ─── Helpers ─── */

function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

const VALID_SESSION_STATUSES = new Set<ChatSessionStatus>([
  "INTERVIEWING",
  "READY_TO_RECOMMEND",
  "STOPPED",
  "RECOMMENDED",
]);

const VALID_NEXT_ACTIONS = new Set<ChatNextAction>(["ASK", "SUGGEST_STOP", "RECOMMEND"]);

function toSessionStatus(value: string): ChatSessionStatus {
  return VALID_SESSION_STATUSES.has(value as ChatSessionStatus)
    ? (value as ChatSessionStatus)
    : "INTERVIEWING";
}

function toNextAction(value: string): ChatNextAction {
  return VALID_NEXT_ACTIONS.has(value as ChatNextAction)
    ? (value as ChatNextAction)
    : "ASK";
}

function deriveSessionStatus(
  status: ChatSessionStatus,
  nextAction: ChatNextAction,
): ChatSessionStatus {
  if (status === "INTERVIEWING" && nextAction === "SUGGEST_STOP") {
    return "READY_TO_RECOMMEND";
  }
  return status;
}

/* ─── Error Handler ─── */

interface ErrorState {
  error: string | null;
  rateLimitMessage: string | null;
  debugInfo: string | null;
}

function handleApiError(err: unknown, context: string): ErrorState {
  if (err instanceof ApiError && err.status === 429) {
    return { error: null, rateLimitMessage: RATE_LIMIT_MSG, debugInfo: null };
  }
  if (err instanceof ApiError) {
    return {
      error: `${context} (${err.status})`,
      rateLimitMessage: null,
      debugInfo: `status=${err.status} | method=${err.method} | path=${err.path} | message=${err.details || err.message}`,
    };
  }
  return {
    error: err instanceof Error ? err.message : context,
    rateLimitMessage: null,
    debugInfo: null,
  };
}

/* ─── Hook ─── */

export function useChat() {
  const showDebug = process.env.NEXT_PUBLIC_CHAT_DEBUG === "true";
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStatus, setSessionStatus] = useState<ChatSessionStatus>("INTERVIEWING");
  const [input, setInput] = useState("");
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const applyError = useCallback((errState: ErrorState) => {
    setError(errState.error);
    setRateLimitMessage(errState.rateLimitMessage);
    setDebugInfo(errState.debugInfo);
  }, []);

  const clearErrors = useCallback(() => {
    setError(null);
    setRateLimitMessage(null);
    setDebugInfo(null);
  }, []);

  const createSession = useCallback(async () => {
    try {
      setIsSessionLoading(true);
      clearErrors();
      const response = await apiFetch<CreateChatSessionResponse>("/api/v1/chat/sessions", {
        method: "POST",
      });
      if (response.sessionId == null) {
        throw new Error("sessionId is missing in API response.");
      }
      setSessionId(response.sessionId);
      setSessionStatus("INTERVIEWING");
      return response.sessionId;
    } catch (err) {
      applyError(handleApiError(err, "세션 생성 실패"));
      return null;
    } finally {
      setIsSessionLoading(false);
    }
  }, [applyError, clearErrors]);

  useEffect(() => {
    void createSession();
  }, [createSession]);

  const sendMessage = useCallback(
    async (text: string, options?: { stopAndRecommend?: boolean }) => {
      const message = text.trim();
      if (!message || isTyping || isSessionLoading || sessionStatus === "RECOMMENDED") {
        return;
      }

      let activeSessionId = sessionId;
      if (!activeSessionId) {
        activeSessionId = await createSession();
        if (!activeSessionId) return;
      }

      setMessages((prev) => [
        ...prev,
        { id: generateId("u"), role: "user", content: message },
      ]);
      setInput("");
      setIsTyping(true);
      clearErrors();
      if (options?.stopAndRecommend) {
        setSessionStatus("STOPPED");
      }

      try {
        const res = await apiFetch<SendChatMessageResponse>("/api/v1/chat/messages", {
          method: "POST",
          body: { sessionId: activeSessionId, message },
        });

        const nextAction = toNextAction(res.nextAction);
        const rawStatus = toSessionStatus(res.sessionStatus);
        const finalStatus = deriveSessionStatus(rawStatus, nextAction);

        setSessionStatus(finalStatus);
        setMessages((prev) => [
          ...prev,
          {
            id: res.assistantMessageId ? String(res.assistantMessageId) : generateId("a"),
            role: "assistant",
            content: res.assistantContent,
            nextAction,
            sessionStatus: finalStatus,
            recommendations: res.recommendations?.length ? res.recommendations : undefined,
            cta: res.cta ?? undefined,
          },
        ]);
      } catch (err) {
        applyError(handleApiError(err, "메시지 전송 실패"));
        if (options?.stopAndRecommend) {
          setSessionStatus("READY_TO_RECOMMEND");
        }
      } finally {
        setIsTyping(false);
      }
    },
    [applyError, clearErrors, createSession, isSessionLoading, isTyping, sessionId, sessionStatus],
  );

  const stopAndRecommend = useCallback(async () => {
    await sendMessage(STOP_COMMAND, { stopAndRecommend: true });
  }, [sendMessage]);

  const resetChat = useCallback(async () => {
    setMessages([WELCOME_MESSAGE]);
    setSessionId(null);
    setSessionStatus("INTERVIEWING");
    setInput("");
    clearErrors();
    await createSession();
  }, [clearErrors, createSession]);

  return {
    showDebug,
    messages,
    sessionStatus,
    input,
    setInput,
    isSessionLoading,
    isTyping,
    error,
    rateLimitMessage,
    debugInfo,
    createSession,
    sendMessage,
    stopAndRecommend,
    resetChat,
  };
}
