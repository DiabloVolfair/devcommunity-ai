import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getKnowledgeEntry, type KnowledgeEntry } from "../services/api";

export default function KnowledgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<KnowledgeEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getKnowledgeEntry(id)
      .then(setEntry)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-full mb-2" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Knowledge entry not found.</p>
        <Link to="/" className="text-sm text-gray-900 underline mt-2 inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  const totalVotes = entry.validations_positive + entry.validations_negative;

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        &larr; Back to feed
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded border bg-gray-50 text-gray-700 border-gray-200">
            {entry.technology}
          </span>
          {entry.trust_score > 0 && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                entry.trust_score >= 80
                  ? "bg-green-50 text-green-700"
                  : entry.trust_score >= 50
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {entry.trust_score}% trusted
            </span>
          )}
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {entry.problem_title}
        </h1>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Problem description */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Problem</h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {entry.problem_description}
        </p>
        {entry.error_pattern && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs font-medium text-red-800 mb-1">
              Error Pattern
            </p>
            <code className="text-xs text-red-700 font-mono">
              {entry.error_pattern}
            </code>
          </div>
        )}
      </div>

      {/* Solution */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Solution</h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {entry.solution}
        </p>
      </div>

      {/* Community validation */}
      {totalVotes > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Community Validation
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">&#10003;</span>
              <span className="text-sm text-gray-700">
                <span className="font-semibold">
                  {entry.validations_positive}
                </span>{" "}
                confirmed this works
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">&#10007;</span>
              <span className="text-sm text-gray-700">
                <span className="font-semibold">
                  {entry.validations_negative}
                </span>{" "}
                reported issues
              </span>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  entry.trust_score >= 80
                    ? "bg-green-500"
                    : entry.trust_score >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${entry.trust_score}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Trust score: {entry.trust_score}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
