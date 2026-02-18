import type { ChatRecommendation } from "@/lib/types";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: ChatRecommendation;
}) {
  return (
    <section className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-700">
          {recommendation.category}
        </span>
        {recommendation.name ? (
          <h4 className="text-sm font-semibold">{recommendation.name}</h4>
        ) : (
          <h4 className="text-sm font-semibold">{String(recommendation.itemId)}</h4>
        )}
      </div>
      <p className="text-xs text-gray-600">{recommendation.reason}</p>
    </section>
  );
}
