export function TypingIndicator() {
  return (
    <li className="flex justify-start">
      <div className="inline-flex items-center gap-1 rounded-[20px] border border-gray-200 bg-white px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500" />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: "120ms" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: "240ms" }}
        />
      </div>
    </li>
  );
}
