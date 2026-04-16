import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import type { HeaderResult } from "../types/scan";

interface Props {
  headers: HeaderResult[];
}

export default function HeadersTable({ headers }: Props) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-cyber-600/50">
        <h3 className="text-sm font-semibold text-cyber-100 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck size={16} className="text-neon-blue" />
          Security Headers
        </h3>
      </div>
      <div className="divide-y divide-cyber-700/40">
        {headers.map((h) => (
          <div key={h.key} className="px-5 py-3 flex items-center gap-4 hover:bg-cyber-700/20 transition-colors">
            <div className="flex-shrink-0">
              {h.present ? <ShieldCheck size={20} className="text-neon-green" /> : h.severity === "high" ? <ShieldX size={20} className="text-neon-red" /> : <ShieldAlert size={20} className="text-neon-yellow" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{h.header}</span>
              </div>
              <p className="text-xs text-cyber-300 mt-0.5">{h.description}</p>
            </div>
            <span className={`text-xs font-bold uppercase ${h.present ? "text-neon-green" : "text-neon-red"}`}>{h.present ? "Found" : "Missing"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
