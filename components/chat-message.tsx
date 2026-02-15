import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { RecommendationCard } from "@/components/recommendation-card";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <li className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        <article
          className={[
            "rounded-[20px] px-4 py-2 text-sm transition",
            isUser
              ? "bg-black text-white hover:bg-gray-800"
              : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
          ].join(" ")}
        >
          <p className="whitespace-pre-wrap break-words leading-6">{message.content}</p>
        </article>
        {!isUser && message.recommendation ? (
          <RecommendationCard recommendation={message.recommendation} />
        ) : null}
      </div>
    </li>
  );
}
