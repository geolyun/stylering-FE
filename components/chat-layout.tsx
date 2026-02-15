import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { Sidebar } from "@/components/sidebar";
import { AuthHeader } from "@/components/auth-header";

export function ChatLayout() {
  return (
    <main className="mx-auto flex h-screen w-full max-w-3xl gap-3 bg-white p-3 text-sm text-gray-900">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <AuthHeader title="StyleRing Chat" />
        <ChatMessages />
        <ChatInput />
      </section>
    </main>
  );
}
