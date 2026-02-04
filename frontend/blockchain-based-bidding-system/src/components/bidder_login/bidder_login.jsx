import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login.png";
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import lockIcon from "../../assets/lock.png";
import "./bidder_login.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const { id, token, role } = res.data;

      if (!id || !token) {
        setError("Login failed: No user data returned");
        return;
      }

      // Save user info
      localStorage.setItem("userId", id);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Navigate to bidder dashboard or NFTs page
      navigate("/my-nft");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="login-box">
        <div className="login-title">
          <span className="login-main-text">Login</span>
          <span className="login-sub-text">as a Bidder</span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={userIcon} alt="Email" className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <img src={lockIcon} alt="Password" className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>

        <button className="google-login-btn">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Login with Google
        </button>

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
