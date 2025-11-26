
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupBg from "../../assets/signup.png"; 
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import emailIcon from "../../assets/email.png";
import lockIcon from "../../assets/lock.png";
import { Link } from "react-router-dom";
import { registerUser } from "../../api/auth";
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


  const handleLogin = async (email, password) =>{
    try{
       const res = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });
    console.log(res.data);

  }
  catch (err){
    console.log(err.response.data); 
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await registerUser({ username, email, password, role: "bidder" });
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("Registration failed: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="signup-container"
      style={{ backgroundImage: `url(${signupBg})`, height: "100vh" }}
    >
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <Link to="/" className="logo-text">CryptOps</Link>
      </div>

      <div className="signup-box">
        <div className="signup-title">
          <span className="signup-main-text">Sign Up As a bidder</span>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={userIcon} alt="User" className="input-icon" />
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
            <img src={lockIcon} alt="Confirm" className="input-icon" />
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
          <p style={{
            color: message.includes("successful") ? "green" : "red",
            marginTop: "10px",
            textAlign: "center"
          }}>
            {message}
          </p>
        )}

        <button className="google-signup-btn">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Sign Up with Google
        </button>

        <div className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
