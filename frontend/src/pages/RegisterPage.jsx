import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  const handleRegister = (formData) => {
    signup(formData); //Llama a la función del contexto para registrar al usuario
  };

  return (
    <div className="register-page">
      <RegisterForm onSubmit={handleRegister} errors={registerErrors} />
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
