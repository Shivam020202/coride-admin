import { useEffect, useState } from "react";
import {
  Activity,
  Users,
  Car,
  Clock,
  MapPin,
  Navigation,
  RefreshCw,
} from "lucide-react";
import Header from "../components/Header";
import api from "../api";
import "./Table.css";
import "./LiveMonitor.css";

export default function LiveMonitor() {
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [stats, setStats] = useState<any>(null);

  const refresh = () => {
    api.get("/active-rides").then((r) => {
      setActiveRides(r.data.activeRides || []);
      setActiveRequests(r.data.activeRequests || []);
      setLastUpdate(new Date());
    });
    api.get("/stats").then((r) => setStats(r.data));
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatStatus = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="page-wrapper">
      <Header title="Live Monitor" />
      <div className="page-content">
        {/* Live stats bar */}
        <div className="live-stats-bar">
          <div className="live-indicator">
            <span className="live-pulse" />
            <span>Live</span>
          </div>
          <div className="live-stat-items">
            <div className="live-stat-item">
              <Car size={15} />
              <span>{activeRides.length} Active Rides</span>
            </div>
            <div className="live-stat-item">
              <Clock size={15} />
              <span>{activeRequests.length} Pending Requests</span>
            </div>
            <div className="live-stat-item">
              <Users size={15} />
              <span>{stats?.totalUsers || 0} Total Users</span>
            </div>
            <div className="live-stat-item">
              <Activity size={15} />
              <span>{stats?.completedRides || 0} Completed Today</span>
            </div>
          </div>
          <button className="refresh-btn" onClick={refresh}>
            <RefreshCw size={14} />
            <span>{lastUpdate.toLocaleTimeString()}</span>
          </button>
        </div>

        {/* Active rides grid */}
        <h3 className="section-title">
          Active Rides ({activeRides.length})
        </h3>
        {activeRides.length > 0 ? (
          <div className="active-rides-grid">
            {activeRides.map((r: any) => (
              <div key={r.id} className="active-ride-card">
                <div className="arc-header">
                  <span className={`status-badge ${r.status}`}>
                    {formatStatus(r.status)}
                  </span>
                  <span className="arc-price">${r.price}</span>
                </div>
                <div className="arc-route">
                  <div className="route-point">
                    <MapPin size={13} className="pickup-icon" />
                    <span>{r.pickup}</span>
                  </div>
                  <div className="route-point">
                    <Navigation size={13} className="dest-icon" />
                    <span>{r.destination}</span>
                  </div>
                </div>
                <div className="arc-footer">
                  <span>
                    Rider: <strong>{r.user}</strong>
                  </span>
                  <span>
                    Driver: <strong>{r.driverName}</strong>
                  </span>
                </div>
                {r.driverLocation && (
                  <div className="arc-location">
                    <MapPin size={12} />
                    <span>
                      {r.driverLocation.lat.toFixed(4)},{" "}
                      {r.driverLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-active">
            <Car size={32} strokeWidth={1.5} />
            <p>No active rides at the moment</p>
          </div>
        )}

        {/* Pending requests */}
        <h3 className="section-title">
          Pending Requests ({activeRequests.length})
        </h3>
        {activeRequests.length > 0 ? (
          <div className="active-rides-grid">
            {activeRequests.map((r: any) => (
              <div key={r.id} className="active-ride-card pending">
                <div className="arc-header">
                  <span className="status-badge pending">Waiting</span>
                  <span className="arc-price">${r.price}</span>
                </div>
                <div className="arc-route">
                  <div className="route-point">
                    <MapPin size={13} className="pickup-icon" />
                    <span>{r.pickup}</span>
                  </div>
                  <div className="route-point">
                    <Navigation size={13} className="dest-icon" />
                    <span>{r.destination}</span>
                  </div>
                </div>
                <div className="arc-footer">
                  <span>
                    Rider: <strong>{r.user}</strong>
                  </span>
                  <span className="text-muted">
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-active small">
            <p>No pending requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
