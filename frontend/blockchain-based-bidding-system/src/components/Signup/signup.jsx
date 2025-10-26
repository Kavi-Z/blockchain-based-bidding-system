import React from "react";
import signupBg from "../../assets/signup.png"; 
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import emailIcon from "../../assets/email.png";
import lockIcon from "../../assets/lock.png";
import { Link } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  return (
    <div
      className="signup-container"
      style={{ backgroundImage: `url(${signupBg})`}}
    >
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <span className="logo-text">CryptOps</span>
      </div>

      <div className="signup-box">
        <div className="signup-title">
          <span className="signup-main-text">Sign Up As a bidder</span>
          <span className="signup-sub-text"></span>
        </div>

        <form className="signup-form">
          <div className="input-group">
            <img src={userIcon} alt="User" className="input-icon" />
            <input type="text" placeholder="Full Name" className="signup-input" />
          </div>
          <div className="input-group">
            <img src={emailIcon} alt="Email" className="input-icon" />
            <input type="email" placeholder="Email" className="signup-input" />
          </div>
          <div className="input-group">
            <img src={userIcon} alt="Username" className="input-icon" />
            <input type="text" placeholder="Username" className="signup-input" />
          </div>
          <div className="input-group">
            <img src={lockIcon} alt="Password" className="input-icon" />
            <input type="password" placeholder="Password" className="signup-input" />
          </div>
          <div className="input-group">
            <img src={lockIcon} alt="Confirm" className="input-icon" />
            <input type="password" placeholder="Confirm Password" className="signup-input" />
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

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
