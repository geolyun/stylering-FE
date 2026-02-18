import type { CSSProperties } from "react";
import { RecommendationCard } from "@/components/recommendation-card";
import type { ChatRecommendation } from "@/lib/types";

interface RecommendationResultsProps {
  summary: string;
  recommendations: ChatRecommendation[];
  onRestartInterview: () => void;
}

export function RecommendationResults({
  summary,
  recommendations,
  onRestartInterview,
}: RecommendationResultsProps) {
  return (
    <section className="space-y-3 rounded-[20px] border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">추천 결과</h2>
        <button
          type="button"
          onClick={onRestartInterview}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          다시 인터뷰 시작
        </button>
      </div>
      {summary ? (
        <p className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base font-semibold leading-6 text-gray-900">
          {summary}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.slice(0, 3).map((recommendation, index) => (
          <div
            key={`${recommendation.itemId}-${index}`}
            className="animate-recommendation-fade"
            style={{ animationDelay: `${index * 80}ms` } as CSSProperties}
          >
            <RecommendationCard recommendation={recommendation} />
          </div>
        ))}
      </div>
    </section>
  );
}
