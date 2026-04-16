import { useState, useEffect, useCallback } from "react";
import { Shield, Zap } from "lucide-react";
import type { ScanResult } from "./types/scan";
import { runScan, getScans } from "./api/client";
import ScanForm from "./components/ScanForm";
import ScanDetail from "./components/ScanDetail";
import ScanHistory from "./components/ScanHistory";
import StatsBar from "./components/StatsBar";

export default function App() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScans = useCallback(async () => {
    try {
      const data = await getScans();
      setScans(data);
    } catch {
      // API might not be available yet
    }
  }, []);

  useEffect(() => {
    loadScans();
  }, [loadScans]);

  const handleScan = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await runScan(url);
      setSelectedScan(result);
      await loadScans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <header className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Shield size={36} className="text-neon-blue" />
              <Zap size={14} className="text-neon-green absolute -top-1 -right-1" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-white">Sec</span>
              <span className="text-neon-blue">Scanner</span>
            </h1>
          </div>
          <p className="text-cyber-300 text-sm max-w-md mx-auto">
            Analyze security headers, open ports, and SSL/TLS configuration for any website.
          </p>
        </header>

        <ScanForm onScan={handleScan} loading={loading} />

        {error && (
          <div className="glass-card rounded-xl p-4 border-neon-red/30 text-neon-red text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {loading && (
          <div className="glass-card rounded-xl p-8 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-neon-blue/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-neon-green animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-neon-purple animate-spin" style={{ animationDuration: "2s" }} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Scanning Target...</p>
              <p className="text-cyber-400 text-xs mt-1">Checking security headers, ports, and SSL configuration</p>
            </div>
          </div>
        )}

        {selectedScan && !loading ? (
          <ScanDetail scan={selectedScan} onBack={() => setSelectedScan(null)} />
        ) : (
          !loading && (
            <>
              <StatsBar scans={scans} />
              <ScanHistory scans={scans} onSelect={setSelectedScan} />
            </>
          )
        )}
      </div>
    </div>
  );
}
