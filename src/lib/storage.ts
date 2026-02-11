import type { AnalysisResult } from "./analysis";

export interface SavedCall {
  id: string;
  title: string;
  date: string; // ISO string
  transcript: string;
  result: AnalysisResult;
}

const STORAGE_KEY = "interview-coach-calls";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function saveCall(
  title: string,
  transcript: string,
  result: AnalysisResult
): SavedCall {
  const call: SavedCall = {
    id: generateId(),
    title,
    date: new Date().toISOString(),
    transcript,
    result,
  };
  const calls = getAllCalls();
  calls.unshift(call);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calls));
  return call;
}

export function getAllCalls(): SavedCall[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCall(id: string): SavedCall | null {
  const calls = getAllCalls();
  return calls.find((c) => c.id === id) ?? null;
}

export function deleteCall(id: string): void {
  const calls = getAllCalls().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calls));
}
