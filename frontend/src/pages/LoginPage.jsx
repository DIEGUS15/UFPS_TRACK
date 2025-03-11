import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import WatchmanLogin from "../components/WatchmanLogin"; // Importa el nuevo componente

function LoginPage() {
  const { signin, errors: siginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isWatchmanLogin, setIsWatchmanLogin] = useState(false); // Estado para alternar entre login tradicional y watchman

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      signin(formData);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="login-container">
      {siginErrors.map((error, i) => (
        <div key={i} className="error-message">
          {error}
        </div>
      ))}
      <h1>Login</h1>

      {isWatchmanLogin ? (
        <WatchmanLogin />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <p className="error-text">{formErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {formErrors.password && (
              <p className="error-text">{formErrors.password}</p>
            )}
          </div>

          <button type="submit">Login</button>
        </form>
      )}

      <button
        onClick={() => setIsWatchmanLogin(!isWatchmanLogin)}
        className="toggle-login-button"
      >
        {isWatchmanLogin ? "Login with Email" : "Login as Watchman"}
      </button>

      <button onClick={handleGoogleLogin} className="google-login-button">
        Login with Google
      </button>

      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
