import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MyReservations from "../components/student/MyReservations";
import NewReservation from "../components/student/NewReservation";

function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <div className="student-sections">
        <NewReservation />
        <MyReservations />
      </div>
    </div>
  );
}

export default StudentDashboard;
