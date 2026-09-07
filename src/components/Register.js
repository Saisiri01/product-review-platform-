import React, { useState } from "react";
import axios from "axios";

function Register({ showLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://product-review-platform-a9iq.onrender.com/api/auth/register", {
        name,
        email,
        password
      })
      .then((response) => {
        alert(response.data.message);

        setName("");
        setEmail("");
        setPassword("");

        showLogin();
      })
      .catch((error) => {
        console.log("Registration Error:", error);
        console.log("Server Response:", error.response?.data);

        alert(
          error.response?.data?.message ||
            error.message ||
            "Registration failed"
        );
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <button
            className="link-button"
            onClick={showLogin}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;