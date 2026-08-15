import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-bold">DR</span>
          </div>
          <span className="font-semibold text-gray-900 hidden sm:block">
            DevResolve
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search problems and solutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/ask"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Ask Question
          </Link>
        </div>
      </div>
    </header>
  );
}
