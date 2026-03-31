import { useEffect, useState } from "react";
import {
  Users,
  Car,
  DollarSign,
  Activity,
  TrendingUp,
  Star,
  Clock,
  UserCheck,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import api from "../api";
import "./Dashboard.css";

interface Stats {
  totalUsers: number;
  totalRiders: number;
  totalDrivers: number;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  currentActiveRides: number;
  pendingRequests: number;
  totalRevenue: number;
  avgRating: number;
  revenueByDay: { _id: string; revenue: number; rides: number }[];
  ridesByDay: { _id: string; count: number }[];
  usersByDay: { _id: string; count: number }[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/stats")
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header title="Dashboard" />
        <div className="page-content">
          <div className="loading-state">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const s = stats!;
  const pieData = [
    { name: "Completed", value: s.completedRides },
    { name: "Active", value: s.currentActiveRides },
    { name: "Pending", value: s.pendingRequests },
    { name: "Cancelled", value: s.cancelledRides },
  ].filter((d) => d.value > 0);

  // If no data, show placeholder chart data
  const revenueData =
    s.revenueByDay.length > 0
      ? s.revenueByDay.map((d) => ({
          date: d._id.slice(5),
          revenue: d.revenue,
          rides: d.rides,
        }))
      : Array.from({ length: 14 }, (_, i) => ({
          date: `Day ${i + 1}`,
          revenue: 0,
          rides: 0,
        }));

  const ridesData =
    s.ridesByDay.length > 0
      ? s.ridesByDay.map((d) => ({ date: d._id.slice(5), rides: d.count }))
      : Array.from({ length: 14 }, (_, i) => ({
          date: `Day ${i + 1}`,
          rides: 0,
        }));

  return (
    <div className="page-wrapper">
      <Header title="Dashboard" />
      <div className="page-content">
        {/* Stats row */}
        <div className="stats-grid">
          <StatCard
            label="Total Users"
            value={s.totalUsers.toLocaleString()}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Total Rides"
            value={s.totalRides.toLocaleString()}
            icon={Car}
            color="green"
          />
          <StatCard
            label="Total Revenue"
            value={`$${s.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            label="Active Now"
            value={s.currentActiveRides}
            icon={Activity}
            color="orange"
          />
        </div>

        {/* Secondary stats */}
        <div className="stats-grid-small">
          <div className="mini-stat">
            <UserCheck size={16} />
            <div>
              <span className="mini-label">Riders</span>
              <span className="mini-value">{s.totalRiders}</span>
            </div>
          </div>
          <div className="mini-stat">
            <Car size={16} />
            <div>
              <span className="mini-label">Drivers</span>
              <span className="mini-value">{s.totalDrivers}</span>
            </div>
          </div>
          <div className="mini-stat">
            <TrendingUp size={16} />
            <div>
              <span className="mini-label">Completed</span>
              <span className="mini-value">{s.completedRides}</span>
            </div>
          </div>
          <div className="mini-stat">
            <Star size={16} />
            <div>
              <span className="mini-label">Avg Rating</span>
              <span className="mini-value">{s.avgRating || "N/A"}</span>
            </div>
          </div>
          <div className="mini-stat">
            <Clock size={16} />
            <div>
              <span className="mini-label">Pending</span>
              <span className="mini-value">{s.pendingRequests}</span>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="charts-row">
          <div className="chart-card wide">
            <h3>Revenue (Last 30 days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Ride Status</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">No ride data yet</div>
            )}
          </div>
        </div>

        {/* Rides chart */}
        <div className="chart-card full">
          <h3>Daily Rides (Last 30 days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ridesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11 }} stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="rides" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
