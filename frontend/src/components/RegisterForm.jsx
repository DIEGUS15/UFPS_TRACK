import React, { useState } from "react";

function RegisterForm({ onSubmit, errors }) {
  const [formData, setFormData] = useState({
    username: "user",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); //Llama a la función que se pasa como prop
  };

  return (
    <div className="register-form-container">
      {errors.map((error, index) => (
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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="form-imput"
        />
        {!formData.password && (
          <p className="error-text">Password is required</p>
        )}

        <button type="submit" className="form-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
