import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { Sidebar } from "@/components/sidebar";

export function ChatLayout() {
  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl gap-3 bg-white p-3 text-sm text-gray-900">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <header className="rounded-card border border-gray-200 bg-gray-50 px-3 py-2">
          <h1 className="text-sm font-semibold text-gray-900">StyleRing Chat</h1>
        </header>
        <ChatMessages />
        <ChatInput />
      </section>
    </main>
  );
}
