import type { KeyboardEvent } from "react";
import type { RefObject } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  textareaRef,
}: ChatInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="rounded-[20px] border border-gray-300 bg-white p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          aria-label="Chat message input"
          className="min-h-20 flex-1 resize-none rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-gray-400"
          placeholder="메시지를 입력하세요"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onSend}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
