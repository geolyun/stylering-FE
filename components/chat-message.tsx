import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { RecommendationCard } from "@/components/recommendation-card";

interface ChatMessageProps {
  message: ChatMessageType;
  onStopAndRecommend: () => void;
  onContinue: () => void;
}

export function ChatMessage({
  message,
  onStopAndRecommend,
  onContinue,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const shouldShowCta = !isUser && message.nextAction === "SUGGEST_STOP";
  const primaryLabel = message.cta?.primary?.label ?? "STOP_AND_RECOMMEND";
  const secondaryLabel = message.cta?.secondary?.label ?? "CONTINUE";

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
        {!isUser && message.recommendations?.length
          ? message.recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={`${message.id}-recommendation-${index}`}
                recommendation={recommendation}
              />
            ))
          : null}
        {shouldShowCta ? (
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onStopAndRecommend}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50"
            >
              {primaryLabel}
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50"
            >
              {secondaryLabel}
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
