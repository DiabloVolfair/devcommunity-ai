import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProblem, analyzeProblem, type Problem, type Analysis } from "../services/api";

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProblem(id)
      .then(setProblem)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnalyze = async () => {
    if (!id) return;
    setAnalyzing(true);
    try {
      const result = await analyzeProblem(id);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze. Make sure the backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-full mb-2" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Problem not found.</p>
        <Link to="/" className="text-sm text-gray-900 underline mt-2 inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        &larr; Back to feed
      </Link>

      {/* Problem header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">
            Question
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded border bg-gray-50 text-gray-700 border-gray-200">
            {problem.technology}
          </span>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              problem.status === "solved"
                ? "bg-green-50 text-green-600"
                : problem.status === "analyzing"
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {problem.status}
          </span>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          {problem.title}
        </h1>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {problem.description}
        </p>
      </div>

      {/* Error message */}
      {problem.error_message && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Error Message
          </h3>
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
            <code className="text-xs text-red-700 font-mono whitespace-pre-wrap">
              {problem.error_message}
            </code>
          </div>
        </div>
      )}

      {/* Logs */}
      {problem.logs && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Logs</h3>
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <code className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
              {problem.logs}
            </code>
          </div>
        </div>
      )}

      {/* Context */}
      {problem.context && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Additional Context
          </h3>
          <p className="text-sm text-gray-700">{problem.context}</p>
        </div>
      )}

      {/* Analyze button (if no analysis yet) */}
      {!analysis && (
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing with AI...
            </span>
          ) : (
            "Analyze with AI"
          )}
        </button>
      )}

      {/* Analysis results */}
      {analysis && (
        <>
          {/* Confidence */}
          <div
            className={`rounded-lg border p-4 ${
              analysis.confidence === "high"
                ? "bg-green-50 border-green-200"
                : analysis.confidence === "medium"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  analysis.confidence === "high"
                    ? "bg-green-500"
                    : analysis.confidence === "medium"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-sm font-medium capitalize">
                {analysis.confidence} confidence analysis
              </span>
            </div>
          </div>

          {/* Understanding */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Problem Understanding
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {analysis.understanding}
            </p>
          </div>

          {/* Likely causes */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Likely Causes
            </h3>
            <ul className="space-y-2">
              {analysis.likely_causes.map((cause, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 shrink-0">&#x2022;</span>
                  {cause}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Recommended Solution
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {analysis.recommended_solution}
            </p>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Troubleshooting Steps
            </h3>
            <ol className="space-y-2">
              {analysis.troubleshooting_steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 w-5 h-5 rounded flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Additional notes */}
          {analysis.additional_notes && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Additional Notes
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {analysis.additional_notes}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
