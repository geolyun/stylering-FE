import type { ChatRecommendation } from "@/lib/types";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: ChatRecommendation;
}) {
  return (
    <section className="h-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
          {recommendation.category}
        </span>
        {recommendation.name ? (
          <h4 className="text-sm font-semibold">{recommendation.name}</h4>
        ) : (
          <h4 className="text-sm font-semibold">{String(recommendation.itemId)}</h4>
        )}
      </div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">추천 이유</p>
      <p className="text-sm font-medium leading-6 text-gray-800">{recommendation.reason}</p>
    </section>
  );
}
