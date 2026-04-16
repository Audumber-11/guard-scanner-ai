export interface HeaderResult {
  header: string;
  key: string;
  present: boolean;
  value: string;
  severity: "high" | "medium" | "low";
  description: string;
  error?: string;
}

export interface PortResult {
  port: number;
  status: "open" | "closed";
}

export interface ScanResult {
  id: number;
  url: string;
  hostname?: string;
  scanned_at?: string;
  overall_score: number;
  headers: HeaderResult[];
  ports: PortResult[];
  ssl_valid: boolean;
  server_info: string;
}
