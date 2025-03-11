import { useState } from "react";
import axios from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const WatchmanLogin = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated, setUser } = useAuth(); // Asegúrate de que estas funciones estén disponibles
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Sending token to backend:", token); // Depuración
      const response = await axios.post("/watchman/login", { token });
      console.log("Response from backend:", response.data); // Depuración

      if (response.data) {
        setIsAuthenticated(true); // Asegúrate de que esta función esté disponible
        setUser({ role: "watchman" }); // Actualiza el estado del usuario
        navigate("/profile"); // Redirige al perfil
      }
    } catch (err) {
      console.error("Error during watchman login:", err); // Depuración
      setError("Invalid or expired token");
    }
  };

  return (
    <div className="watchman-login-container">
      {error && <div className="error-message">{error}</div>}
      <h1>Watchman Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Token</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your token"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default WatchmanLogin;
