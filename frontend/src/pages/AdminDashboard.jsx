import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BuildingsPanel from "../components/admin/BuildingsPanel";
import FloorsPanel from "../components/admin/FloorsPanel";
import RoomsPanel from "../components/admin/RoomsPanel";
import SeatsPanel from "../components/admin/SeatsPanel";

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-sections">
        <BuildingsPanel />
        <FloorsPanel />
        <RoomsPanel />
        <SeatsPanel />
      </div>
    </div>
  );
}

export default AdminDashboard;
