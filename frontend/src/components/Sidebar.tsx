import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/ask", label: "Ask a Question", icon: "💬" },
    { path: "/knowledge", label: "Knowledge Base", icon: "📚" },
  ];

  return (
    <aside className="w-60 shrink-0 hidden lg:block">
      <div className="sticky top-20">
        {/* Branding */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
          <h2 className="font-bold text-base text-gray-900 mb-1">
            DevCommunity AI
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            AI-powered troubleshooting backed by community-validated solutions.
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-gray-900 border border-gray-200"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
