export function ChatInput() {
  return (
    <div className="rounded-card border border-gray-300 bg-white p-3">
      <div className="flex items-end gap-2">
        <textarea
          aria-label="Chat message input"
          className="min-h-20 flex-1 resize-none rounded-xl border border-gray-200 p-2 text-sm text-gray-900 outline-none focus:border-gray-400"
          placeholder="Type your message..."
          disabled
        />
        <button
          type="button"
          className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled
        >
          Send
        </button>
      </div>
    </div>
  );
}
