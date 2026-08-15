import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitProblem, analyzeProblem, type Analysis } from "../services/api";

const TECHNOLOGIES = [
  "Docker",
  "Git",
  "AWS",
  "Python",
  "Node.js",
  "React",
  "JavaScript",
  "TypeScript",
  "Kubernetes",
  "Linux",
  "Other",
];

export default function AskPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    technology: "",
    title: "",
    description: "",
    error_message: "",
    logs: "",
    context: "",
  });
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "analyzing" | "result">("form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep("analyzing");

    try {
      const problem = await submitProblem({
        technology: formData.technology,
        title: formData.title,
        description: formData.description,
        error_message: formData.error_message || undefined,
        logs: formData.logs || undefined,
        context: formData.context || undefined,
      });

      const result = await analyzeProblem(problem.id);
      setAnalysis(result);
      setStep("result");
    } catch (err) {
      console.error(err);
      setStep("form");
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "analyzing") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-600">
          Analyzing your problem with AI and community knowledge...
        </p>
      </div>
    );
  }

  if (step === "result" && analysis) {
    return (
      <div className="space-y-4">
        {/* Back button */}
        <button
          onClick={() => {
            setStep("form");
            setAnalysis(null);
          }}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          &larr; Ask another question
        </button>

        {/* Confidence banner */}
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
              {analysis.confidence} confidence
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

        {/* Recommended solution */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Recommended Solution
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {analysis.recommended_solution}
          </p>
        </div>

        {/* Troubleshooting steps */}
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h1 className="text-lg font-semibold text-gray-900 mb-1">
        Ask a Technical Question
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Describe your problem and our AI will analyze it using community
        knowledge.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Technology */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Technology
          </label>
          <select
            required
            value={formData.technology}
            onChange={(e) =>
              setFormData({ ...formData, technology: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gray-400"
          >
            <option value="">Select technology...</option>
            {TECHNOLOGIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title
          </label>
          <input
            type="text"
            required
            minLength={5}
            placeholder="Brief description of your problem"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            required
            minLength={10}
            rows={4}
            placeholder="What happened? What were you trying to do?"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-y"
          />
        </div>

        {/* Error message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Error Message{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Paste the error message or stack trace"
            value={formData.error_message}
            onChange={(e) =>
              setFormData({ ...formData, error_message: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-y"
          />
        </div>

        {/* Logs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Logs{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Relevant log output"
            value={formData.logs}
            onChange={(e) =>
              setFormData({ ...formData, logs: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-y"
          />
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Additional Context{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="OS, versions, config details, etc."
            value={formData.context}
            onChange={(e) =>
              setFormData({ ...formData, context: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Analyzing..." : "Submit & Analyze"}
        </button>
      </form>
    </div>
  );
}
