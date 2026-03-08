import React from "react";
import { useNavigate } from "react-router-dom";
import "./main_login.css";
import logo from "../../assets/cryptops.png";

const Main_Login = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === "bidder") {
      navigate("/bidder_login");
    } else {
      navigate("/seller-login");
    }
  };

  return (
    <div className="main-login-page">
      <div className="main-login-card">

      
        {logo ? (
          <img src={logo} alt="CryptOps" className="main-login-logo" />
        ) : (
          <div className="main-login-badge">CRPT</div>
        )}

        <h1 className="main-login-title">
          Welcome to <span>CryptOps</span>
        </h1>

        <p className="main-login-subtitle">Select your role to continue</p>

        <div className="main-login-divider" />

        <div className="main-login-buttons">
          <button
            className="main-login-btn seller"
            onClick={() => handleLogin("seller")}
          >
            {/* Seller icon */}
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13" />
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
            Log in as Seller
          </button>

          <button
            className="main-login-btn bidder"
            onClick={() => handleLogin("bidder")}
          >
             
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2.5l7 7-10 10-7-7 10-10z" />
              <path d="M3 21l6-6" />
            </svg>
            Log in as Bidder
          </button>
        </div>

        <p className="main-login-footer">
          New here?&nbsp;<a href="/register">Create an account</a>
        </p>

      </div>
    </div>
  );
};

export default Main_Login;