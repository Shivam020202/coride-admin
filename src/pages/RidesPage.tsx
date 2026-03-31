import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
} from "lucide-react";
import Header from "../components/Header";
import api from "../api";
import "./Table.css";

interface Ride {
  _id: string;
  riderName: string;
  driverName: string;
  pickup: string;
  destination: string;
  price: number;
  status: string;
  distance: string;
  duration: string;
  createdAt: string;
  completedAt: string;
}

interface ActiveRide {
  id: string;
  user: string;
  driverName: string;
  pickup: string;
  destination: string;
  price: number;
  status: string;
  createdAt: string;
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeRides, setActiveRides] = useState<ActiveRide[]>([]);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [tab, setTab] = useState<"history" | "active">("history");

  const fetchRides = () => {
    setLoading(true);
    api
      .get("/rides", { params: { page, search, status, limit: 15 } })
      .then((r) => {
        setRides(r.data.rides);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchActive = () => {
    api
      .get("/active-rides")
      .then((r) => {
        setActiveRides(r.data.activeRides || []);
        setActiveRequests(r.data.activeRequests || []);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchRides();
    fetchActive();
    const interval = setInterval(fetchActive, 5000);
    return () => clearInterval(interval);
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRides();
  };

  const formatStatus = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="page-wrapper">
      <Header title="Rides" />
      <div className="page-content">
        {/* Tab switcher */}
        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === "history" ? "active" : ""}`}
            onClick={() => setTab("history")}
          >
            Ride History
            <span className="tab-count">{total}</span>
          </button>
          <button
            className={`tab-btn ${tab === "active" ? "active" : ""}`}
            onClick={() => setTab("active")}
          >
            Active Now
            <span className="tab-count live">
              {activeRides.length}
            </span>
          </button>
          <button
            className={`tab-btn ${tab === "active" ? "" : ""}`}
            onClick={() => { setTab("active"); fetchActive(); }}
            style={{ marginLeft: "auto", fontSize: "0.8rem", opacity: 0.6 }}
          >
            Pending Requests: {activeRequests.length}
          </button>
        </div>

        {tab === "history" ? (
          <>
            {/* Filters */}
            <div className="table-toolbar">
              <form onSubmit={handleSearch} className="toolbar-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search rides..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <div className="toolbar-filters">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in_transit">In Transit</option>
                  <option value="picking_up">Picking Up</option>
                </select>
              </div>
            </div>

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Rider</th>
                    <th>Driver</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="table-empty">Loading...</td>
                    </tr>
                  ) : rides.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="table-empty">No rides found</td>
                    </tr>
                  ) : (
                    rides.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <div className="route-cell">
                            <div className="route-point">
                              <MapPin size={13} className="pickup-icon" />
                              <span className="route-text">{r.pickup}</span>
                            </div>
                            <div className="route-point">
                              <Navigation size={13} className="dest-icon" />
                              <span className="route-text">{r.destination}</span>
                            </div>
                          </div>
                        </td>
                        <td className="user-name">{r.riderName}</td>
                        <td className="text-muted">{r.driverName || "—"}</td>
                        <td className="price-cell">${r.price.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${r.status}`}>
                            {formatStatus(r.status)}
                          </span>
                        </td>
                        <td className="text-muted">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="page-btn">
                  <ChevronLeft size={16} />
                </button>
                <span className="page-info">Page {page} of {pages}</span>
                <button disabled={page === pages} onClick={() => setPage(page + 1)} className="page-btn">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Active rides view */
          <div className="active-rides-grid">
            {activeRides.length === 0 && activeRequests.length === 0 ? (
              <div className="empty-active">
                <p>No active rides or pending requests right now.</p>
              </div>
            ) : (
              <>
                {activeRides.map((r) => (
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
                      <span>Rider: <strong>{r.user}</strong></span>
                      <span>Driver: <strong>{r.driverName}</strong></span>
                    </div>
                  </div>
                ))}
                {activeRequests.map((r: any) => (
                  <div key={r.id} className="active-ride-card pending">
                    <div className="arc-header">
                      <span className="status-badge pending">Pending</span>
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
                      <span>Rider: <strong>{r.user}</strong></span>
                      <span>Waiting for driver...</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
