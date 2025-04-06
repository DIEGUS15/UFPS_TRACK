import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Reservation System</Link>
      </div>
      <div className="navbar-links">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            {user?.role === "watchman" && (
              <Link to="/watchman">Watchman Dashboard</Link>
            )}
            {user?.role === "student" && (
              <Link to="/student">Student Dashboard</Link>
            )}
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
