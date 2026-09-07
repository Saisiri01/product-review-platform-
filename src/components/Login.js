import React, { useState } from "react";
import axios from "axios";

function Login({ showRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://product-review-platform-a9iq.onrender.com/api/auth/login", {
        email,
        password
      })
      .then((response) => {
        alert(response.data.message);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        onLogin(response.data.user);
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "Login failed"
        );
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

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
            Login
          </button>

        </form>

        <p>
          Don't have an account?{" "}
          <button
            className="link-button"
            onClick={showRegister}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;