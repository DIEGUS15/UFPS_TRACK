import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>

      {/* Redirigir al dashboard según el rol */}
      {user.role === "admin" && navigate("/admin")}
      {user.role === "watchman" && navigate("/watchman")}
      {user.role === "student" && navigate("/student")}
    </div>
  );
}

export default ProfilePage;
