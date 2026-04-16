import { Activity, ShieldCheck, ShieldX, Radio } from "lucide-react";
import type { ScanResult } from "../types/scan";

export default function StatsBar({ scans }: any) {
  if (scans.length === 0) return null;
  const avgScore = Math.round(scans.reduce((s: any, r: any) => s + r.overall_score, 0) / scans.length);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <Activity size={18} className="text-neon-blue" />
        <div><div className="text-xl font-bold text-white font-mono">{avgScore}</div><div className="text-[10px] uppercase text-cyber-400">Avg Score</div></div>
      </div>
    </div>
  );
}
