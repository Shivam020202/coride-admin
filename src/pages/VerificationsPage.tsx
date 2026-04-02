import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import Header from "../components/Header";
import api from "../api";
import "./Table.css";
import "./VerificationsPage.css";

interface DocItem {
  name: string;
  required: boolean;
  status: string;
  fileUrl?: string;
  submittedAt?: string;
}

interface Verification {
  _id: string;
  driverId: string;
  driverName: string;
  driverEmail: string;
  status: string;
  documents: DocItem[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewNote?: string;
  createdAt: string;
}

interface VStats {
  pendingReview: number;
  approved: number;
  rejected: number;
  incomplete: number;
}

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function VerificationsPage({ onMenuClick }: { onMenuClick: () => void }) {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Verification | null>(null);
  const [note, setNote] = useState("");
  const [stats, setStats] = useState<VStats>({ pendingReview: 0, approved: 0, rejected: 0, incomplete: 0 });

  const fetchVerifications = () => {
    setLoading(true);
    api
      .get("/verifications", { params: { page, search, status: statusFilter, limit: 15 } })
      .then((r) => {
        setVerifications(r.data.verifications);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchStats = () => {
    api.get("/verification-stats").then((r) => setStats(r.data)).catch(console.error);
  };

  useEffect(() => {
    fetchVerifications();
    fetchStats();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVerifications();
  };

  const viewDetail = async (id: string) => {
    const r = await api.get(`/verifications/${id}`);
    setSelected(r.data);
    setNote("");
  };

  const handleApprove = async () => {
    if (!selected) return;
    await api.post(`/verifications/${selected._id}/approve`, { note });
    setSelected(null);
    fetchVerifications();
    fetchStats();
  };

  const handleReject = async () => {
    if (!selected) return;
    if (!note.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    await api.post(`/verifications/${selected._id}/reject`, { note });
    setSelected(null);
    fetchVerifications();
    fetchStats();
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending_review": return "Pending Review";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "incomplete": return "Incomplete";
      default: return s;
    }
  };

  const docStatusBadge = (s: string) => {
    switch (s) {
      case "submitted": return <span className="v-badge pending_review">Submitted</span>;
      case "approved": return <span className="v-badge approved">Approved</span>;
      case "rejected": return <span className="v-badge rejected">Rejected</span>;
      default: return <span className="v-badge incomplete">Not Submitted</span>;
    }
  };

  return (
    <div className="page-wrapper">
      <Header title="Driver Verifications" onMenuClick={onMenuClick} />
      <div className="page-content">
        {/* Stats */}
        <div className="verification-stats">
          <div className="v-stat-card">
            <div className="v-stat-icon pending"><Clock size={20} /></div>
            <div className="v-stat-info">
              <h4>{stats.pendingReview}</h4>
              <p>Pending Review</p>
            </div>
          </div>
          <div className="v-stat-card">
            <div className="v-stat-icon approved"><CheckCircle size={20} /></div>
            <div className="v-stat-info">
              <h4>{stats.approved}</h4>
              <p>Approved</p>
            </div>
          </div>
          <div className="v-stat-card">
            <div className="v-stat-icon rejected"><XCircle size={20} /></div>
            <div className="v-stat-info">
              <h4>{stats.rejected}</h4>
              <p>Rejected</p>
            </div>
          </div>
          <div className="v-stat-card">
            <div className="v-stat-icon incomplete"><AlertTriangle size={20} /></div>
            <div className="v-stat-info">
              <h4>{stats.incomplete}</h4>
              <p>Incomplete</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="table-toolbar">
          <form onSubmit={handleSearch} className="toolbar-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by driver name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="toolbar-filters">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="incomplete">Incomplete</option>
            </select>
            <span className="total-badge">{total} records</span>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Email</th>
                <th>Status</th>
                <th>Documents</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="table-empty">Loading...</td></tr>
              ) : verifications.length === 0 ? (
                <tr><td colSpan={6} className="table-empty">No verification records found</td></tr>
              ) : (
                verifications.map((v) => {
                  const completed = v.documents.filter((d) => d.status !== "pending").length;
                  return (
                    <tr key={v._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {v.driverName.charAt(0).toUpperCase()}
                          </div>
                          <span className="user-name">{v.driverName}</span>
                        </div>
                      </td>
                      <td className="text-muted">{v.driverEmail}</td>
                      <td>
                        <span className={`v-badge ${v.status}`}>
                          {statusLabel(v.status)}
                        </span>
                      </td>
                      <td className="text-muted">
                        {completed}/{v.documents.length}
                      </td>
                      <td className="text-muted">
                        {v.submittedAt
                          ? new Date(v.submittedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="icon-btn blue"
                            onClick={() => viewDetail(v._id)}
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

        {/* Detail Modal */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="v-modal-panel" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>

              <div className="v-modal-header">
                <div className="v-modal-avatar">
                  {selected.driverName.charAt(0).toUpperCase()}
                </div>
                <div className="v-modal-header-info">
                  <h2>{selected.driverName}</h2>
                  <p>{selected.driverEmail}</p>
                </div>
                <span className={`v-badge ${selected.status}`} style={{ marginLeft: "auto" }}>
                  {statusLabel(selected.status)}
                </span>
              </div>

              <div className="v-docs-title">
                <FileText size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                Submitted Documents ({selected.documents.filter(d => d.status !== "pending").length}/{selected.documents.length})
              </div>

              {selected.documents.map((doc) => (
                <div key={doc.name} className="v-doc-row">
                  <span className="v-doc-name">
                    {doc.name}
                    {!doc.required && <span style={{ color: "#a1a1aa", fontSize: "0.7rem", marginLeft: 6 }}>(Optional)</span>}
                  </span>
                  <div className="v-doc-status">
                    {doc.fileUrl && (
                      <a
                        href={`${API_BASE}${doc.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="v-doc-link"
                      >
                        View File
                      </a>
                    )}
                    {docStatusBadge(doc.status)}
                  </div>
                </div>
              ))}

              {selected.reviewNote && (
                <div style={{ marginTop: 16, padding: "12px 14px", background: "#f8fafc", borderRadius: 10, fontSize: "0.825rem", color: "#475569" }}>
                  <strong>Review Note:</strong> {selected.reviewNote}
                </div>
              )}

              {(selected.status === "pending_review" || selected.status === "rejected") && (
                <>
                  <textarea
                    className="v-note-input"
                    placeholder="Add a review note (required for rejection)..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="v-modal-actions">
                    <button className="v-action-btn reject" onClick={handleReject}>
                      Reject
                    </button>
                    <button className="v-action-btn approve" onClick={handleApprove}>
                      Approve Driver
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
