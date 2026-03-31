import type { LucideIcon } from "lucide-react";
import "./StatCard.css";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

const colorMap = {
  blue: { bg: "var(--accent-light)", fg: "var(--accent)" },
  green: { bg: "var(--success-light)", fg: "var(--success)" },
  purple: { bg: "var(--purple-light)", fg: "var(--purple)" },
  orange: { bg: "var(--warning-light)", fg: "var(--warning)" },
  red: { bg: "var(--danger-light)", fg: "var(--danger)" },
};

export default function StatCard({ label, value, icon: Icon, trend, trendUp, color = "blue" }: Props) {
  const c = colorMap[color];
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: c.bg, color: c.fg }}>
        <Icon size={20} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend ${trendUp ? "up" : "down"}`}>
            {trendUp ? "+" : ""}{trend}
          </span>
        )}
      </div>
    </div>
  );
}
