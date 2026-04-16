import { useMemo } from "react";

interface Props {
  score: number;
  size?: number;
}

export default function ScoreGauge({ score, size = 180 }: Props) {
  const { color, label, glowColor } = useMemo(() => {
    if (score >= 80) return { color: "#00ff88", label: "Secure", glowColor: "rgba(0,255,136,0.3)" };
    if (score >= 50) return { color: "#ffcc00", label: "Warning", glowColor: "rgba(255,204,0,0.3)" };
    return { color: "#ff3366", label: "Critical", glowColor: "rgba(255,51,102,0.3)" };
  }, [score]);

  const r = (size - 20) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1c2644" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset 1s ease-out" }} />
        <text x={size / 2} y={size / 2 - 8} textAnchor="middle" fill={color} fontSize="36" fontWeight="bold">{score}</text>
        <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fill="#7a94bb" fontSize="12">/ 100</text>
      </svg>
      <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full" style={{ color, border: `1px solid ${color}`, background: `${color}11` }}>{label}</span>
    </div>
  );
}
