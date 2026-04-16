import { Clock, ExternalLink } from "lucide-react";
import type { ScanResult } from "../types/scan";

export default function ScanHistory({ scans, onSelect }: any) {
  if (scans.length === 0) return null;
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-cyber-600/50">
        <h3 className="text-sm font-semibold text-cyber-100 uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} className="text-neon-blue" />
          Scan History
        </h3>
      </div>
      <div className="divide-y divide-cyber-700/40">
        {scans.map((scan: any) => (
          <button key={scan.id} onClick={() => onSelect(scan)} className="w-full text-left px-5 py-3.5 hover:bg-cyber-700/20 transition-colors flex items-center gap-4 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm border">{scan.overall_score}</div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-white">{scan.url}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
