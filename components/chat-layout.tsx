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
  } = useChat();

  const isRecommended = sessionStatus === "RECOMMENDED";
  const isStopped = sessionStatus === "STOPPED";
  const inputDisabled = isTyping || isSessionLoading || isRecommended || isStopped;
  const placeholder = isRecommended ? "새 상담을 시작해주세요." : "메시지를 입력하세요.";

  const handleContinue = () => {
    inputRef.current?.focus();
  };

  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl gap-3 bg-white p-3 text-sm text-gray-900">
      <Sidebar onNewChat={() => void resetChat()} />
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <AuthHeader title="StyleRing Chat" />
        {isRecommended ? (
          <div className="flex items-center gap-2">
            <div className="inline-flex w-fit items-center rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
              스타일 분석 완료
            </div>
            <button
              type="button"
              onClick={() => void resetChat()}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              새 상담 시작
            </button>
          </div>
        ) : null}
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
                재시도
              </button>
            </div>
            {showDebug && debugInfo ? (
              <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-2 text-[11px] leading-4 text-gray-600">
                {debugInfo}
              </pre>
            ) : null}
          </div>
        ) : null}
        {isStopped ? (
          <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-700">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            추천 생성 중...
          </div>
        ) : null}
        <MessageList
          messages={messages}
          isTyping={isTyping && !isStopped}
          sessionStatus={sessionStatus}
          onStopAndRecommend={() => void stopAndRecommend()}
          onContinue={handleContinue}
        />
        <ChatInput
          textareaRef={inputRef}
          value={input}
          onChange={setInput}
          onSend={() => void sendMessage(input)}
          disabled={inputDisabled}
          placeholder={placeholder}
        />
      </section>
    </main>
  );
}
