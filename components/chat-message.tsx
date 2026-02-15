import type { ChatMessage as ChatMessageType } from "@/lib/types";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <li className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={[
          "max-w-[85%] rounded-[20px] px-4 py-2 text-sm transition",
          isUser
            ? "bg-black text-white hover:bg-gray-800"
            : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words leading-6">{message.content}</p>
      </article>
    </li>
  );
}
