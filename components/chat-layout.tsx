"use client";

import { useMemo, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { MessageList } from "@/components/message-list";
import { Sidebar } from "@/components/sidebar";
import { AuthHeader } from "@/components/auth-header";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

const dummyMessages: ChatMessageType[] = [
  {
    id: "m1",
    role: "assistant",
    content: "안녕하세요. StyleRing 어시스턴트입니다.",
  },
  {
    id: "m2",
    role: "user",
    content: "컴팩트 채팅 UI를 보여줘.",
  },
  {
    id: "m3",
    role: "assistant",
    content: "좋아요. 오른쪽은 사용자, 왼쪽은 어시스턴트 버블로 구성했습니다.",
  },
];

const dummyReplies = [
  "좋은 질문입니다. 다음 단계로 진행해볼까요?",
  "요청하신 형태로 반영 가능합니다.",
  "현재 상태에서 API 연결도 바로 확장할 수 있습니다.",
];

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessageType[]>(dummyMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const nextReply = useMemo(
    () => dummyReplies[messages.length % dummyReplies.length],
    [messages.length],
  );

  const handleSend = () => {
    const content = input.trim();
    if (!content || isTyping) {
      return;
    }

    const userMessage: ChatMessageType = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: nextReply,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl gap-3 bg-white p-3 text-sm text-gray-900">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <AuthHeader title="StyleRing Chat" />
        <MessageList messages={messages} isTyping={isTyping} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isTyping}
        />
      </section>
    </main>
  );
}
