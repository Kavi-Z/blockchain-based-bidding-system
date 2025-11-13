import React from "react";
import { useNavigate } from "react-router-dom";
import "./main_login.css";
import logo from "../../assets/cryptops.png";

const Main_Login = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === "seller") {
      navigate("/bidder_login");
    } else {
      navigate("/bidder-dashboard");
    }
  };

  return (
    <div className="main-login-page">
      <div className="main-login-card">
     
        <h1 className="main-login-title">Welcome to CryptOps</h1>
        <p className="main-login-subtitle">Select your role to continue</p>

        <div className="main-login-buttons">
          <button
            className="main-login-btn seller"
            onClick={() => handleLogin("seller")}
          >
            Log in as Seller
          </button>
          <button
            className="main-login-btn bidder"
            onClick={() => handleLogin("bidder")}
          >
            Log in as Bidder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main_Login;
