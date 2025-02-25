import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        {registerErrors.map((error, index) => (
          <div className="error-message" key={index}>
            {error}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="form-input"
          />
          {!formData.username && (
            <p className="error-text">Username is required</p>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-input"
          />
          {!formData.email && <p className="error-text">Email is required</p>}

          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
            className="form-input"
          />
          {!formData.role && <p className="error-text">Role is required</p>}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-input"
          />
          {!formData.password && (
            <p className="error-text">Password is required</p>
          )}

          <button type="submit" className="form-button">
            Register
          </button>
        </form>
      </div>
      <p className="redirect-text">
        Already have an account?{" "}
        <Link to="/login" className="redirect-link">
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;

//ANTIGUO

// import React, { useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import RegisterForm from "../components/RegisterForm";

// function RegisterPage() {
//   const { signup, isAuthenticated, errors: registerErrors } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated) navigate("/profile");
//   }, [isAuthenticated, navigate]);

//   const handleRegister = (formData) => {
//     signup(formData); //Llama a la función del contexto para registrar al usuario
//   };

//   return (
//     <div className="register-page">
//       <RegisterForm onSubmit={handleRegister} errors={registerErrors} />
//       <p className="redirect-text">
//         Already have an account?{" "}
//         <Link to="/login" className="redirect-link">
//           Login
//         </Link>
//       </p>
//     </div>
//   );
// }

// export default RegisterPage;
