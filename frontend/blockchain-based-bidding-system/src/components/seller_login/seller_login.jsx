import React, { useState } from "react";
import loginBg from "../../assets/login.png";
import logo from "../../assets/cryptops.png";
import googleIcon from "../../assets/google.png"; 
import userIcon from "../../assets/user.png";
import lockIcon from "../../assets/lock.png";
import { Link, useNavigate } from "react-router-dom";
import "./seller_login.css";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/seller-login", {
        email,
        password,
      });

      console.log("Seller Login Response:", res.data);

      const userId =
        res.data.userId ||
        res.data.id ||
        res.data._id ||
        (res.data.user && res.data.user._id) ||
        (res.data.data && res.data.data._id);

      console.log("Extracted userId:", userId);

      if (!userId) {
        console.log("❌ userId not found in response!");
        return;
      }

      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", "seller");

      navigate("/seller-dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/seller-login", {
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
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", "seller");

      navigate("/seller-dashboard");  
    } catch (err) {
      setError(err.message);
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

        {error && <p className="error-text">{error}</p>}

        <form className="seller-login-form" onSubmit={handleSubmit}>
          <div className="seller-input-group">
            <img src={userIcon} alt="Username" className="seller-input-icon" />
            <input
              type="text"
              placeholder="Email"
              className="seller-login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <button type="submit" className="seller-login-btn">Login</button>
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