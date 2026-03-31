import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  UserCircle,
} from "lucide-react";
import Header from "../components/Header";
import api from "../api";
import "./Table.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/users", { params: { page, search, role, limit: 15 } })
      .then((r) => {
        setUsers(r.data.users);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const viewUser = async (id: string) => {
    const r = await api.get(`/users/${id}`);
    setSelectedUser(r.data);
  };

  return (
    <div className="page-wrapper">
      <Header title="Users" />
      <div className="page-content">
        {/* Filters */}
        <div className="table-toolbar">
          <form onSubmit={handleSearch} className="toolbar-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="toolbar-filters">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="consumer">Riders</option>
              <option value="driver">Drivers</option>
            </select>
            <span className="total-badge">{total} users</span>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span
                        className={`role-badge ${u.role === "driver" ? "driver" : "rider"}`}
                      >
                        {u.role === "consumer" ? "Rider" : "Driver"}
                      </span>
                    </td>
                    <td className="text-muted capitalize">{u.gender}</td>
                    <td className="text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="icon-btn blue"
                          onClick={() => viewUser(u._id)}
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="icon-btn red"
                          onClick={() => handleDelete(u._id)}
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="page-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-info">
              Page {page} of {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="page-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* User detail modal */}
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                &times;
              </button>
              <div className="modal-user-header">
                <UserCircle size={48} strokeWidth={1.5} />
                <div>
                  <h2>{selectedUser.user.name}</h2>
                  <p className="text-muted">{selectedUser.user.email}</p>
                </div>
              </div>
              <div className="modal-stats-row">
                <div className="modal-stat">
                  <span className="modal-stat-value">
                    {selectedUser.ridesAsRider}
                  </span>
                  <span className="modal-stat-label">Rides (Rider)</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">
                    {selectedUser.ridesAsDriver}
                  </span>
                  <span className="modal-stat-label">Rides (Driver)</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">
                    ${selectedUser.totalSpent.toFixed(2)}
                  </span>
                  <span className="modal-stat-label">Total Spent</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-value">
                    ${selectedUser.totalEarned.toFixed(2)}
                  </span>
                  <span className="modal-stat-label">Total Earned</span>
                </div>
              </div>
              <div className="modal-details">
                <div className="detail-row">
                  <span>Role</span>
                  <span className={`role-badge ${selectedUser.user.role === "driver" ? "driver" : "rider"}`}>
                    {selectedUser.user.role === "consumer" ? "Rider" : "Driver"}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Gender</span>
                  <span className="capitalize">{selectedUser.user.gender}</span>
                </div>
                <div className="detail-row">
                  <span>Joined</span>
                  <span>
                    {new Date(selectedUser.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
