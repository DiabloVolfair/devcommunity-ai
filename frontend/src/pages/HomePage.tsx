import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed, type FeedItem } from "../services/api";

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function getTechColor(tech: string): string {
  const colors: Record<string, string> = {
    Docker: "bg-blue-50 text-blue-700 border-blue-200",
    Git: "bg-orange-50 text-orange-700 border-orange-200",
    AWS: "bg-amber-50 text-amber-700 border-amber-200",
    Python: "bg-green-50 text-green-700 border-green-200",
    "Node.js": "bg-emerald-50 text-emerald-700 border-emerald-200",
    React: "bg-cyan-50 text-cyan-700 border-cyan-200",
    JavaScript: "bg-yellow-50 text-yellow-700 border-yellow-200",
    TypeScript: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Kubernetes: "bg-purple-50 text-purple-700 border-purple-200",
    Linux: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return colors[tech] || "bg-gray-50 text-gray-700 border-gray-200";
}

function FeedCard({ item }: { item: FeedItem }) {
  const totalVotes = item.validations_positive + item.validations_negative;
  const linkTo =
    item.type === "knowledge" ? `/knowledge/${item.id}` : `/problem/${item.id}`;

  return (
    <article className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
      {/* Type indicator + tech badge */}
      <div className="flex items-center gap-2 mb-3">
        {item.type === "problem" ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">
            Question
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
            Solved
          </span>
        )}
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded border ${getTechColor(
            item.technology
          )}`}
        >
          {item.technology}
        </span>
        <span className="text-xs text-gray-400">{timeAgo(item.created_at)}</span>
      </div>

      {/* Title */}
      <Link
        to={linkTo}
        className="block text-base font-semibold text-gray-900 mb-2 hover:text-gray-700 leading-snug"
      >
        {item.title}
      </Link>

      {/* Description preview */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        {item.trust_score != null && item.trust_score > 0 && (
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                item.trust_score >= 80
                  ? "bg-green-500"
                  : item.trust_score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-xs font-medium text-gray-600">
              {item.trust_score}% trust
            </span>
          </div>
        )}
        {totalVotes > 0 && (
          <span className="text-xs text-gray-400">
            {item.validations_positive} confirmed
          </span>
        )}
        {item.status && item.type === "problem" && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              item.status === "solved"
                ? "bg-green-50 text-green-600"
                : item.status === "analyzing"
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.status}
          </span>
        )}
      </div>
    </article>
  );
}

export default function HomePage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "questions" | "solved">("all");

  useEffect(() => {
    getFeed()
      .then((data) => setItems(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems =
    activeTab === "questions"
      ? items.filter((i) => i.type === "problem")
      : activeTab === "solved"
      ? items.filter((i) => i.type === "knowledge")
      : items;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
        {(["all", "questions", "solved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "all" ? "All" : tab === "questions" ? "Questions" : "Solved"}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse"
            >
              <div className="flex gap-2 mb-3">
                <div className="h-4 bg-gray-100 rounded w-16" />
                <div className="h-4 bg-gray-100 rounded w-14" />
              </div>
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-1" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">
            No items yet. Be the first to{" "}
            <Link to="/ask" className="text-gray-900 underline">
              ask a question
            </Link>
            !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <FeedCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
