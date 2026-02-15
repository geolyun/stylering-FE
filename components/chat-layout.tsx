"use client";

import { useRef } from "react";
import { ChatInput } from "@/components/chat-input";
import { MessageList } from "@/components/message-list";
import { Sidebar } from "@/components/sidebar";
import { AuthHeader } from "@/components/auth-header";
import { useChat } from "@/lib/use-chat";

export function ChatLayout() {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const {
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
  } = useChat();

  const handleStopAndRecommend = () => {
    void sendMessage("추천해줘");
  };

  const handleContinue = () => {
    inputRef.current?.focus();
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
          <div className="space-y-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700">
            <div className="flex items-center justify-between gap-2">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void createSession()}
                className="rounded-lg border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-100"
                disabled={isSessionLoading}
              >
                Retry
              </button>
            </div>
            {showDebug && debugInfo ? (
              <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-2 text-[11px] leading-4 text-gray-600">
                {debugInfo}
              </pre>
            ) : null}
          </div>
        ) : null}
        <MessageList
          messages={messages}
          isTyping={isTyping}
          onStopAndRecommend={handleStopAndRecommend}
          onContinue={handleContinue}
        />
        <ChatInput
          textareaRef={inputRef}
          value={input}
          onChange={setInput}
          onSend={() => void sendMessage(input)}
          disabled={isTyping || isSessionLoading}
        />
      </section>
    </main>
  );
}
