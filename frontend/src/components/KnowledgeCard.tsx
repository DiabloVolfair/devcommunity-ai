import { Link } from "react-router-dom";
import type { KnowledgeEntry } from "../services/api";

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
  };
  return colors[tech] || "bg-gray-50 text-gray-700 border-gray-200";
}

interface Props {
  entry: KnowledgeEntry;
}

export default function KnowledgeCard({ entry }: Props) {
  const totalVotes = entry.validations_positive + entry.validations_negative;

  return (
    <article className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
      {/* Technology badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded border ${getTechColor(
            entry.technology
          )}`}
        >
          {entry.technology}
        </span>
        <span className="text-xs text-gray-400">{timeAgo(entry.created_at)}</span>
      </div>

      {/* Title */}
      <Link
        to={`/knowledge/${entry.id}`}
        className="block text-base font-semibold text-gray-900 mb-2 hover:text-gray-700 leading-snug"
      >
        {entry.problem_title}
      </Link>

      {/* Description preview */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
        {entry.solution}
      </p>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {entry.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: trust score + validations */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        {entry.trust_score > 0 && (
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                entry.trust_score >= 80
                  ? "bg-green-500"
                  : entry.trust_score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-xs font-medium text-gray-600">
              {entry.trust_score}% trust
            </span>
          </div>
        )}
        {totalVotes > 0 && (
          <span className="text-xs text-gray-400">
            {entry.validations_positive} confirmed
          </span>
        )}
      </div>
    </article>
  );
}
