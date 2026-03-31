import { Search, Bell } from "lucide-react";
import "./Header.css";

export default function Header({ title }: { title: string }) {
  return (
    <header className="admin-header">
      <h1 className="page-title">{title}</h1>
      <div className="header-actions">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search anything..." />
        </div>
        <button className="notif-btn">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>
        <div className="admin-avatar">
          <span>A</span>
        </div>
      </div>
    </header>
  );
}
