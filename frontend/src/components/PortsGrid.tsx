import { Radio } from "lucide-react";
import type { PortResult } from "../types/scan";

interface Props {
  ports: PortResult[];
}

const KNOWN_SERVICES: any = { 21: "FTP", 22: "SSH", 80: "HTTP", 443: "HTTPS", 3306: "MySQL", 5432: "PostgreSQL", 8080: "HTTP Alt", 8443: "HTTPS Alt" };

export default function PortsGrid({ ports }: Props) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-cyber-600/50">
        <h3 className="text-sm font-semibold text-cyber-100 uppercase tracking-wider flex items-center gap-2">
          <Radio size={16} className="text-neon-purple" />
          Port Scan Results
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5">
        {ports.map((p) => {
          const isOpen = p.status === "open";
          const isDangerous = isOpen && ![80, 443].includes(p.port);
          return (
            <div key={p.port} className={`rounded-lg p-3 text-center border transition-all ${isOpen ? (isDangerous ? "border-neon-yellow/40 bg-neon-yellow/5" : "border-neon-green/40 bg-neon-green/5") : "border-cyber-600/40 bg-cyber-800/40"}`}>
              <div className="font-mono text-lg font-bold text-white">{p.port}</div>
              <div className="text-[10px] text-cyber-300 uppercase">{KNOWN_SERVICES[p.port] || "Unknown"}
              </div>
              <div className={`mt-2 text-[10px] font-bold uppercase ${isOpen ? (isDangerous ? "text-neon-yellow" : "text-neon-green") : "text-cyber-400"}`}>{p.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
