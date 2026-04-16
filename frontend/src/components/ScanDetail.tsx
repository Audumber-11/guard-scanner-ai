import { ArrowLeft, Lock, Unlock, Server, Globe } from "lucide-react";
import type { ScanResult } from "../types/scan";
import ScoreGauge from "./ScoreGauge";
import HeadersTable from "./HeadersTable";
import PortsGrid from "./PortsGrid";

interface Props {
  scan: ScanResult;
  onBack: () => void;
}

export default function ScanDetail({ scan, onBack }: Props) {
  const headersPresent = scan.headers.filter((h) => h.present).length;
  const openPorts = scan.ports.filter((p) => p.status === "open").length;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cyber-300 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ScoreGauge score={scan.overall_score} />
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">{scan.url}</h2>
              {scan.scanned_at && (
                <p className="text-xs text-cyber-400 mt-1">
                  Scanned at {new Date(scan.scanned_at).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <InfoChip
                icon={scan.ssl_valid ? <Lock size={14} /> : <Unlock size={14} />}
                label="SSL/TLS"
                value={scan.ssl_valid ? "Valid" : "Invalid"}
                variant={scan.ssl_valid ? "success" : "danger"}
              />
              <InfoChip
                icon={<Globe size={14} />}
                label="Headers"
                value={`${headersPresent}/${scan.headers.length}`}
                variant={headersPresent >= 5 ? "success" : headersPresent >= 3 ? "warning" : "danger"}
              />
              <InfoChip
                icon={<Server size={14} />}
                label="Open Ports"
                value={String(openPorts)}
                variant={openPorts <= 2 ? "success" : "warning"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <HeadersTable headers={scan.headers} />
        <PortsGrid ports={scan.ports} />
      </div>
    </div>
  );
}

function InfoChip({ icon, label, value, variant }: any) {
  const colors: any = {
    success: "border-neon-green/30 text-neon-green bg-neon-green/5",
    warning: "border-neon-yellow/30 text-neon-yellow bg-neon-yellow/5",
    danger: "border-neon-red/30 text-neon-red bg-neon-red/5",
    neutral: "border-cyber-500/30 text-cyber-200 bg-cyber-700/30",
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${colors[variant]}`}>
      {icon}
      <span className="text-cyber-300">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
