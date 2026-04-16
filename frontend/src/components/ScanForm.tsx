import { useState } from "react";
import { Search, Loader2, Globe } from "lucide-react";

interface Props {
  onScan: (url: string) => void;
  loading: boolean;
}

export default function ScanForm({ onScan, loading }: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onScan(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-card rounded-2xl p-1.5 flex items-center gap-2 focus-within:border-neon-blue/50 transition-colors">
        <div className="pl-4 text-cyber-400">
          <Globe size={20} />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter target URL (e.g., example.com)"
          disabled={loading}
          className="flex-1 bg-transparent text-white placeholder-cyber-400 text-sm py-3 px-2 outline-none font-mono"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center gap-2 bg-neon-blue/20 hover:bg-neon-blue/30 disabled:opacity-40 disabled:cursor-not-allowed text-neon-blue font-semibold text-sm px-6 py-3 rounded-xl transition-all border border-neon-blue/30 hover:border-neon-blue/50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>
    </form>
  );
}
