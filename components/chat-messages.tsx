import type { ChatMessage } from "@/lib/types";

const seedMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Welcome to StyleRing chat UI skeleton.",
  },
];

export function ChatMessages() {
  return (
    <section className="flex-1 overflow-y-auto rounded-card border border-gray-200 bg-white p-4">
      <ul className="space-y-3">
        {seedMessages.map((message) => (
          <li key={message.id} className="rounded-2xl bg-gray-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {message.role}
            </p>
            <p className="mt-1 text-sm text-gray-900">{message.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
