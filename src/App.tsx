import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import RidesPage from "./pages/RidesPage";
import RevenuePage from "./pages/RevenuePage";
import LiveMonitor from "./pages/LiveMonitor";
import SettingsPage from "./pages/SettingsPage";
import VerificationsPage from "./pages/VerificationsPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("adminAuth") === "true"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/users" element={<UsersPage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/rides" element={<RidesPage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/revenue" element={<RevenuePage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/verifications" element={<VerificationsPage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/live" element={<LiveMonitor onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/settings" element={<SettingsPage onMenuClick={() => setSidebarOpen(true)} />} />
        </Routes>
      </div>
    </>
  );
}
