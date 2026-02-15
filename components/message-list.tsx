"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/components/chat-message";
import { TypingIndicator } from "@/components/typing-indicator";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface MessageListProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  onStopAndRecommend: () => void;
  onContinue: () => void;
}

export function MessageList({
  messages,
  isTyping,
  onStopAndRecommend,
  onContinue,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return (
    <section
      ref={scrollRef}
      className="flex-1 overflow-y-auto rounded-[20px] border border-gray-200 bg-gray-50 p-3"
    >
      <ul className="space-y-3">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onStopAndRecommend={onStopAndRecommend}
            onContinue={onContinue}
          />
        ))}
        {isTyping ? <TypingIndicator /> : null}
      </ul>
    </section>
  );
}
