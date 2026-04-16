import type { ScanResult } from "../types/scan";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function runScan(url: string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Scan failed" }));
    throw new Error(err.detail || "Scan failed");
  }
  return res.json();
}

export async function getScans(): Promise<ScanResult[]> {
  const res = await fetch(`${API_BASE}/scans`);
  if (!res.ok) throw new Error("Failed to load scans");
  return res.json();
}
