import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import RidesPage from "./pages/RidesPage";
import RevenuePage from "./pages/RevenuePage";
import LiveMonitor from "./pages/LiveMonitor";
import SettingsPage from "./pages/SettingsPage";
import VerificationsPage from "./pages/VerificationsPage";

export default function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/rides" element={<RidesPage />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/verifications" element={<VerificationsPage />} />
        <Route path="/live" element={<LiveMonitor />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}
