"use client";

import { useEffect, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { MessageList } from "@/components/message-list";
import { Sidebar } from "@/components/sidebar";
import { AuthHeader } from "@/components/auth-header";
import { ApiError, apiFetch } from "@/lib/api";
import type {
  ChatMessage,
  ChatRecommendation,
  CreateChatSessionResponse,
  SendChatMessageResponse,
} from "@/lib/types";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "안녕하세요. 무엇을 도와드릴까요?",
  },
];

function resolveSessionId(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const value = payload as Record<string, unknown>;
  if (typeof value.sessionId === "string") {
    return value.sessionId;
  }
  const data = value.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (typeof nested.sessionId === "string") {
      return nested.sessionId;
    }
  }
  return null;
}

function resolveAssistantContent(payload: SendChatMessageResponse | null) {
  if (!payload) {
    return "";
  }
  if (typeof payload.content === "string") {
    return payload.content;
  }
  if (typeof payload.message === "string") {
    return payload.message;
  }
  if (typeof payload.text === "string") {
    return payload.text;
  }
  const data = (payload as Record<string, unknown>).data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (typeof nested.content === "string") {
      return nested.content;
    }
    if (typeof nested.message === "string") {
      return nested.message;
    }
    if (typeof nested.text === "string") {
      return nested.text;
    }
  }
  return "";
}

function resolveRecommendation(payload: unknown): ChatRecommendation | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const value = payload as Record<string, unknown>;
  let recommendation = value.recommendation;
  if (!recommendation || typeof recommendation !== "object") {
    const data = value.data;
    if (data && typeof data === "object") {
      recommendation = (data as Record<string, unknown>).recommendation;
    }
  }
  if (!recommendation || typeof recommendation !== "object") {
    return undefined;
  }
  const rec = recommendation as Record<string, unknown>;
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
  return undefined;
}

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function createSession() {
      try {
        setIsSessionLoading(true);
        setError(null);
        const response = await apiFetch<CreateChatSessionResponse>("/api/v1/chat/sessions", {
          method: "POST",
        });
        const nextSessionId = resolveSessionId(response);
        if (!nextSessionId) {
          throw new Error("Missing sessionId");
        }
        if (active) {
          setSessionId(nextSessionId);
        }
      } catch (err) {
        if (!active) {
          return;
        }
        if (err instanceof ApiError && err.status === 429) {
          setRateLimitMessage("요청이 많습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      } finally {
        if (active) {
          setIsSessionLoading(false);
        }
      }
    }

    void createSession();
    return () => {
      active = false;
    };
  }, []);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || !sessionId || isTyping || isSessionLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);
    setRateLimitMessage(null);

    try {
      const response = await apiFetch<SendChatMessageResponse>("/api/v1/chat/messages", {
        method: "POST",
        body: {
          sessionId,
          message,
          content: message,
        },
      });
      const assistantMessage: ChatMessage = {
        id: response.id ?? `a-${Date.now()}`,
        role: "assistant",
        content: resolveAssistantContent(response) || "응답 메시지가 비어 있습니다.",
        recommendation: resolveRecommendation(response),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setRateLimitMessage("요청 제한(429)에 도달했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("메시지를 전송하지 못했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl gap-3 bg-white p-3 text-sm text-gray-900">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <AuthHeader title="StyleRing Chat" />
        {rateLimitMessage ? (
          <div className="rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-xs text-gray-700">
            {rateLimitMessage}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700">
            {error}
          </div>
        ) : null}
        <MessageList messages={messages} isTyping={isTyping} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => void handleSend()}
          disabled={isTyping || isSessionLoading || !sessionId}
        />
      </section>
    </main>
  );
}
