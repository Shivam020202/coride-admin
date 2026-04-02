import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PiggyBank,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import api from "../api";
import "./Dashboard.css";

export default function RevenuePage({ onMenuClick }: { onMenuClick: () => void }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/stats")
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="page-wrapper">
        <Header title="Revenue" onMenuClick={onMenuClick} />
        <div className="page-content">
          <div className="loading-state">Loading revenue data...</div>
        </div>
      </div>
    );
  }

  const s = stats!;
  const avgPerRide = s.completedRides > 0 ? s.totalRevenue / s.completedRides : 0;
  const platformFee = s.totalRevenue * 0.2; // 20% platform cut

  const revenueData =
    s.revenueByDay.length > 0
      ? s.revenueByDay.map((d: any) => ({
          date: d._id.slice(5),
          revenue: d.revenue,
          rides: d.rides,
          avgFare: d.rides > 0 ? Math.round((d.revenue / d.rides) * 100) / 100 : 0,
        }))
      : [];

  // Cumulative revenue
  let cumulative = 0;
  const cumulativeData = revenueData.map((d: any) => {
    cumulative += d.revenue;
    return { ...d, cumulative: Math.round(cumulative * 100) / 100 };
  });

  return (
    <div className="page-wrapper">
      <Header title="Revenue & Payments" onMenuClick={onMenuClick} />
      <div className="page-content">
        <div className="stats-grid">
          <StatCard
            label="Total Revenue"
            value={`$${s.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            label="Platform Earnings (20%)"
            value={`$${platformFee.toFixed(2)}`}
            icon={PiggyBank}
            color="purple"
          />
          <StatCard
            label="Avg. Fare / Ride"
            value={`$${avgPerRide.toFixed(2)}`}
            icon={CreditCard}
            color="blue"
          />
          <StatCard
            label="Completed Rides"
            value={s.completedRides}
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {revenueData.length > 0 ? (
          <>
            <div className="charts-row">
              <div className="chart-card wide">
                <h3>Revenue Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevPage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevPage)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Cumulative Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }} />
                    <Line type="monotone" dataKey="cumulative" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card full">
              <h3>Average Fare Per Day</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }} />
                  <Bar dataKey="avgFare" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="chart-card full">
            <div className="empty-chart">
              No revenue data yet. Revenue will appear here once rides are completed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
