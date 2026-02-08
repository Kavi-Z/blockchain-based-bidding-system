import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../../assets/login.png";
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import lockIcon from "../../assets/lock.png";
import "./seller_login.css";
import axios from "axios";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/seller-login", {
        email,
        password,
      });

      console.log("Seller Login Response:", res.data);

      const { id, token, role, email: userEmail } = res.data;

      if (!id || !token) {
        setError("Login failed: Invalid response from server");
        return;
      }

      // Verify user is a seller
      if (role !== "SELLER") {
        setError("Access denied. This portal is for sellers only.");
        return;
      }

      // Save to localStorage
      localStorage.setItem("userId", id);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("user", JSON.stringify(res.data));

      console.log("✅ Seller logged in successfully!");

      // Navigate to seller dashboard
      navigate("/seller_dashboard");

    } catch (err) {
      console.error("Seller Login Error:", err);
      
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else if (err.response && err.response.status === 403) {
        setError("Access denied. This portal is for sellers only.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="seller-login-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <Link to="/" className="logo-text">CryptOps</Link>
      </div>

      <div className="seller-login-box">
        <div className="seller-login-title">
          <span className="seller-login-main-text">Login</span>
          <span className="seller-login-sub-text">as a Seller</span>
        </div>

        {error && <p className="error-text" style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <form className="seller-login-form" onSubmit={handleSubmit}>
          <div className="seller-input-group">
            <img src={userIcon} alt="Email" className="seller-input-icon" />
            <input
              type="email"
              placeholder="Email"
              className="seller-login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="seller-input-group">
            <img src={lockIcon} alt="Password" className="seller-input-icon" />
            <input
              type="password"
              placeholder="Password"
              className="seller-login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="seller-login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button className="seller-google-login-btn">
          <img src={googleIcon} alt="Google" className="seller-google-icon" />
          Login with Google
        </button>

        <div className="seller-signup-link">
          Don't have an account? <Link to="/seller-signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;