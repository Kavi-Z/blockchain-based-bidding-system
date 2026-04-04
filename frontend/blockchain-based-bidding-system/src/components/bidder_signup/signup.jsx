import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupBg from "../../assets/signup.png";
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png";
import userIcon from "../../assets/user.png";
import emailIcon from "../../assets/email.png";
import lockIcon from "../../assets/lock.png";
import "./signup.css";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) return setMessage("Username is required");
    if (password !== confirmPassword) return setMessage("Passwords do not match");
    if (password.length < 6) return setMessage("Password must be at least 6 characters");

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register/bidder",
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup Response:", res.data);
      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/bidder_login"), 1500);

    } catch (err) {
      console.error(err);
      const serverError = err.response?.data?.error || err.response?.data?.message;
      setMessage("❌ Registration failed: " + (serverError || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="signup-box">
        <div className="signup-title">
          <span className="signup-main-text">Sign Up as a Bidder</span>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={userIcon} alt="Username" className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              className="signup-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <img src={emailIcon} alt="Email" className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              className="signup-input"
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
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <img src={lockIcon} alt="Confirm Password" className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="signup-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p style={{ color: message.includes("successful") ? "green" : "red", marginTop: 10, textAlign: "center" }}>
            {message}
          </p>
        )}

        <button className="google-signup-btn">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Sign Up with Google
        </button>

        <div className="login-link">
          Already have an account? <a href="/bidder_login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
