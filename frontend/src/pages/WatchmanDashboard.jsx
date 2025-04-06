import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReservationsPanel from "../components/watchman/ReservationsPanel";
import RoomsStatus from "../components/watchman/RoomsStatus";

function WatchmanDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "watchman") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="watchman-dashboard">
      <h1>Watchman Dashboard</h1>
      <div className="watchman-sections">
        <ReservationsPanel />
        <RoomsStatus />
      </div>
    </div>
  );
}

export default WatchmanDashboard;
