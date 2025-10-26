import React from "react";
import loginBg from "../../assets/login.png";
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import lockIcon from "../../assets/lock.png";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <span className="logo-text">CryptOps</span>
      </div>

      <div className="login-box">
        <div className="login-title">
          <span className="login-main-text">Login</span>
          <span className="login-sub-text">as a Bidder</span>
        </div>

        <form className="login-form">
          <div className="input-group">
            <img src={userIcon} alt="Username" className="input-icon" />
            <input type="text" placeholder="Username" className="login-input" />
          </div>
          <div className="input-group">
            <img src={lockIcon} alt="Password" className="input-icon" />
            <input type="password" placeholder="Password" className="login-input" />
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
