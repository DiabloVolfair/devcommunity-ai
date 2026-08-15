export default function RightSidebar() {
  const popularTags = [
    "docker",
    "git",
    "aws",
    "python",
    "nodejs",
    "react",
    "kubernetes",
    "linux",
  ];

  return (
    <aside className="w-72 shrink-0 hidden xl:block">
      <div className="sticky top-20 space-y-4">
        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">
            Community Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Problems solved</span>
              <span className="font-medium text-gray-900">142</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Knowledge entries</span>
              <span className="font-medium text-gray-900">89</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Validations</span>
              <span className="font-medium text-gray-900">1.2k</span>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">
            Popular Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">
            How it works
          </h3>
          <ol className="space-y-2 text-xs text-gray-600">
            <li className="flex gap-2">
              <span className="font-bold text-gray-900 shrink-0">1.</span>
              Submit your technical problem
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-gray-900 shrink-0">2.</span>
              AI analyzes with community knowledge
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-gray-900 shrink-0">3.</span>
              Get a validated troubleshooting guide
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-gray-900 shrink-0">4.</span>
              Validate to help future developers
            </li>
          </ol>
        </div>
      </div>
    </aside>
  );
}
