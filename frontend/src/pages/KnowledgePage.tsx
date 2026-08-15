import { useEffect, useState, useCallback } from "react";
import KnowledgeCard from "../components/KnowledgeCard";
import { searchKnowledge, getKnowledge, type KnowledgeEntry } from "../services/api";

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTech, setSearchTech] = useState("");

  const fetchEntries = useCallback(async (query: string, tech: string) => {
    setLoading(true);
    try {
      if (!query.trim() && !tech) {
        const data = await getKnowledge();
        setEntries(data.entries);
      } else {
        const q = query.trim() || "*";
        const data = await searchKnowledge(q, tech || undefined);
        setEntries(data.entries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchEntries("", "");
  }, [fetchEntries]);

  // Re-fetch when tech filter changes
  useEffect(() => {
    fetchEntries(searchQuery, searchTech);
  }, [searchTech]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntries(searchQuery, searchTech);
  };

  return (
    <div>
      {/* Search bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
          <select
            value={searchTech}
            onChange={(e) => setSearchTech(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gray-400"
          >
            <option value="">All tech</option>
            <option value="Docker">Docker</option>
            <option value="Git">Git</option>
            <option value="AWS">AWS</option>
            <option value="Python">Python</option>
            <option value="Node.js">Node.js</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
              <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">
            No results found. Try different keywords.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <KnowledgeCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
