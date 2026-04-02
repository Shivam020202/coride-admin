import { Search, Bell, Menu } from "lucide-react";
import "./Header.css";

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: Props) {
  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
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
