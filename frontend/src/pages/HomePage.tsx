import { useEffect, useState } from "react";
import KnowledgeCard from "../components/KnowledgeCard";
import { getKnowledge, type KnowledgeEntry } from "../services/api";

export default function HomePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"latest" | "top">("latest");

  useEffect(() => {
    getKnowledge()
      .then((data) => setEntries(data.entries))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sortedEntries =
    activeTab === "top"
      ? [...entries].sort((a, b) => b.trust_score - a.trust_score)
      : entries;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("latest")}
          className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
            activeTab === "latest"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => setActiveTab("top")}
          className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
            activeTab === "top"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Top Trusted
        </button>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded w-16 mb-3" />
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-1" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">
            No knowledge entries yet. Be the first to ask a question!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEntries.map((entry) => (
            <KnowledgeCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
