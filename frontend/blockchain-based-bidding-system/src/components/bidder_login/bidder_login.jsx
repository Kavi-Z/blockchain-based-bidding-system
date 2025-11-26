import React, { useState } from "react";
import loginBg from "../../assets/login.png";
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import lockIcon from "../../assets/lock.png";
import { Link, useNavigate } from "react-router-dom";
import "./bidder_login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await res.json();
 
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/my-nft");  
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <Link to="/" className="logo-text">CryptOps</Link>
      </div>

      <div className="login-box">
        <div className="login-title">
          <span className="login-main-text">Login</span>
          <span className="login-sub-text">as a Bidder</span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={userIcon} alt="Username" className="input-icon" />
            <input
              type="text"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <button className="google-login-btn">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Login with Google
        </button>

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
