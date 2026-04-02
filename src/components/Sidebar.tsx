import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Car,
  DollarSign,
  Activity,
  Settings,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";
import "./Sidebar.css";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/rides", icon: Car, label: "Rides" },
  { to: "/revenue", icon: DollarSign, label: "Revenue" },
  { to: "/verifications", icon: ShieldCheck, label: "Verifications" },
  { to: "/live", icon: Activity, label: "Live Monitor" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">C</div>
          <span>CoRide Admin</span>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Main</span>
          {links.slice(0, 5).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <l.icon size={18} />
              <span>{l.label}</span>
            </NavLink>
          ))}

          <span className="nav-section-label">System</span>
          {links.slice(5).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <l.icon size={18} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              sessionStorage.removeItem("adminToken");
              window.location.reload();
            }}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
          <div className="env-badge">Production</div>
          <span className="version">v1.0.0</span>
        </div>
      </aside>
    </>
  );
}
