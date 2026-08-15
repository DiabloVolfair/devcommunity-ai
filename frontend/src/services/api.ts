const API_BASE = "/api";

export interface Problem {
  id: string;
  technology: string;
  title: string;
  description: string;
  error_message?: string;
  logs?: string;
  context?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemCreate {
  technology: string;
  title: string;
  description: string;
  error_message?: string;
  logs?: string;
  context?: string;
}

export interface Analysis {
  problem_id: string;
  understanding: string;
  likely_causes: string[];
  recommended_solution: string;
  troubleshooting_steps: string[];
  additional_notes?: string;
  confidence: string;
  analyzed_at: string;
}

export interface KnowledgeEntry {
  id: string;
  technology: string;
  problem_title: string;
  problem_description: string;
  solution: string;
  error_pattern?: string;
  tags: string[];
  source_problem_id?: string;
  validations_positive: number;
  validations_negative: number;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

// Problems
export async function submitProblem(data: ProblemCreate): Promise<Problem> {
  const res = await fetch(`${API_BASE}/problems/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getProblems(): Promise<{ problems: Problem[]; total: number }> {
  const res = await fetch(`${API_BASE}/problems/`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getProblem(id: string): Promise<Problem> {
  const res = await fetch(`${API_BASE}/problems/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Analysis
export async function analyzeProblem(problemId: string): Promise<Analysis> {
  const res = await fetch(`${API_BASE}/problems/${problemId}/analyze`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Knowledge
export async function getKnowledge(): Promise<{ entries: KnowledgeEntry[]; total: number }> {
  const res = await fetch(`${API_BASE}/knowledge/`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function searchKnowledge(
  q: string,
  technology?: string
): Promise<{ entries: KnowledgeEntry[]; query: string; total: number }> {
  const params = new URLSearchParams({ q });
  if (technology) params.set("technology", technology);
  const res = await fetch(`${API_BASE}/knowledge/search?${params}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getKnowledgeEntry(id: string): Promise<KnowledgeEntry> {
  const res = await fetch(`${API_BASE}/knowledge/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Feed
export interface FeedItem {
  id: string;
  type: "problem" | "knowledge";
  technology: string;
  title: string;
  description: string;
  error_pattern?: string;
  tags: string[];
  status?: string;
  trust_score?: number;
  validations_positive: number;
  validations_negative: number;
  created_at: string;
}

export async function getFeed(): Promise<{ items: FeedItem[]; total: number }> {
  const res = await fetch(`${API_BASE}/feed/`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
