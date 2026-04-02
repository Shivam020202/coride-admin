import { useState } from "react";
import {
  Shield,
  Globe,
  Bell,
  Database,
  Zap,
} from "lucide-react";
import Header from "../components/Header";
import "./SettingsPage.css";

export default function SettingsPage({ onMenuClick }: { onMenuClick: () => void }) {
  const [platformFee, setPlatformFee] = useState("20");
  const [minFare, setMinFare] = useState("5.00");
  const [maxDistance, setMaxDistance] = useState("50");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="page-wrapper">
      <Header title="Settings" onMenuClick={onMenuClick} />
      <div className="page-content">
        <div className="settings-grid">
          {/* Platform config */}
          <div className="settings-card">
            <div className="settings-card-header">
              <Zap size={18} />
              <h3>Platform Configuration</h3>
            </div>
            <div className="settings-field">
              <label>Platform Fee (%)</label>
              <input
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
              />
              <span className="field-hint">Percentage taken from each ride</span>
            </div>
            <div className="settings-field">
              <label>Minimum Fare ($)</label>
              <input
                type="text"
                value={minFare}
                onChange={(e) => setMinFare(e.target.value)}
              />
              <span className="field-hint">Minimum charge per ride</span>
            </div>
            <div className="settings-field">
              <label>Max Distance (miles)</label>
              <input
                type="number"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              />
              <span className="field-hint">Maximum allowed ride distance</span>
            </div>
            <button className="save-btn">Save Changes</button>
          </div>

          {/* Notifications */}
          <div className="settings-card">
            <div className="settings-card-header">
              <Bell size={18} />
              <h3>Notifications</h3>
            </div>
            <div className="settings-toggle">
              <div>
                <span className="toggle-label">Email Notifications</span>
                <span className="toggle-desc">Receive alerts via email</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="settings-toggle">
              <div>
                <span className="toggle-label">Slack Integration</span>
                <span className="toggle-desc">Post updates to Slack</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifSlack}
                  onChange={(e) => setNotifSlack(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="settings-card">
            <div className="settings-card-header">
              <Shield size={18} />
              <h3>Security</h3>
            </div>
            <div className="settings-field">
              <label>JWT Secret</label>
              <input type="password" value="••••••••••••••" readOnly />
              <span className="field-hint">Set via environment variable</span>
            </div>
            <div className="settings-field">
              <label>Admin Password</label>
              <input type="password" placeholder="Change admin password" />
            </div>
            <button className="save-btn">Update Security</button>
          </div>

          {/* System */}
          <div className="settings-card">
            <div className="settings-card-header">
              <Database size={18} />
              <h3>System</h3>
            </div>
            <div className="settings-toggle">
              <div>
                <span className="toggle-label">Maintenance Mode</span>
                <span className="toggle-desc">
                  Disable new rides temporarily
                </span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(e) => setMaintenance(e.target.checked)}
                />
                <span className="slider danger" />
              </label>
            </div>
            <div className="system-info">
              <div className="sys-row">
                <span>Database</span>
                <span className="sys-status online">Connected</span>
              </div>
              <div className="sys-row">
                <span>Socket.IO</span>
                <span className="sys-status online">Running</span>
              </div>
              <div className="sys-row">
                <span>API Version</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>

          {/* API */}
          <div className="settings-card full">
            <div className="settings-card-header">
              <Globe size={18} />
              <h3>API & Environment</h3>
            </div>
            <div className="env-grid">
              <div className="env-item">
                <span className="env-key">API_URL</span>
                <span className="env-val">
                  {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}
                </span>
              </div>
              <div className="env-item">
                <span className="env-key">NODE_ENV</span>
                <span className="env-val">{import.meta.env.MODE}</span>
              </div>
              <div className="env-item">
                <span className="env-key">ADMIN_PORT</span>
                <span className="env-val">5174</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
