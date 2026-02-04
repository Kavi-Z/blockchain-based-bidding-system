import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import signupBg from "../../assets/signup.png"; 
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import emailIcon from "../../assets/email.png";
import lockIcon from "../../assets/lock.png";
import "./seller_signup.css";
import axios from "axios";

const SellerSignup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!username.trim()) {
      setMessage("Username is required");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register/seller",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Seller Signup Response:", res.data);
      
      // Save to localStorage
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);

      setMessage("✅ Registration successful! Redirecting...");
      
      setTimeout(() => {
        navigate("/seller-login");
      }, 1500);

    } catch (err) {
      console.error("Seller Signup Error:", err);
      const serverError = err.response?.data?.error || err.response?.data?.message;
      setMessage("❌ Registration failed: " + (serverError || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="seller-signup-container"
      style={{ backgroundImage: `url(${signupBg})`, height: "100vh" }}
    >
      <div className="seller-logo-container">
        <img src={logo} alt="Logo" className="seller-logo" />
        <Link to="/" className="seller-logo-text">CryptOps</Link>
      </div>

      <div className="seller-signup-box">
        <div className="seller-signup-title">
          <span className="seller-signup-main-text">Sign Up As a Seller</span>
        </div>

        <form className="seller-signup-form" onSubmit={handleSubmit}>
          <div className="seller-input-group">
            <img src={userIcon} alt="User" className="seller-input-icon" />
            <input
              type="text"
              placeholder="Username"
              className="seller-signup-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="seller-input-group">
            <img src={emailIcon} alt="Email" className="seller-input-icon" />
            <input
              type="email"
              placeholder="Email"
              className="seller-signup-input"
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
              className="seller-signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="seller-input-group">
            <img src={lockIcon} alt="Confirm" className="seller-input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="seller-signup-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="seller-signup-btn" 
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p style={{
            color: message.includes("successful") ? "green" : "red",
            marginTop: "10px",
            textAlign: "center",
            fontSize: "14px"
          }}>
            {message}
          </p>
        )}

        <button className="seller-google-signup-btn">
          <img src={googleIcon} alt="Google" className="seller-google-icon" />
          Sign Up with Google
        </button>

        <div className="seller-login-link">
          Already have an account? <Link to="/seller-login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;