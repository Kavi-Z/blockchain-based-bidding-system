import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import './DashboardNavbar.css';
import logo from "../../assets/cryptops.png";

const DashboardNavbar = ({ activePage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';
  const userRole = localStorage.getItem('userRole') || 'USER';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('internalUserId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      await signOut();
    } catch (e) {
      console.error("Logout failed", e);
      navigate('/');
    }
  };

  const goToDashboard = () => {
    if (userRole === 'SELLER') navigate('/seller-dashboard');
    else if (userRole === 'BIDDER') navigate('/bidder-dashboard');
    else navigate('/');
  };

  return (
    <nav className={`dashboard-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <div className="navbar-logo" onClick={goToDashboard}>
          <img src={logo} alt="CryptOps Logo" className="logo-img" />
          <span className="logo-text">CryptOps</span>
        </div>
        <div className="navbar-links">
          <span 
            className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={goToDashboard}
          >
            Dashboard
          </span>
          {userRole === 'SELLER' && (
            <span 
              className={`nav-link ${activePage === 'create-auction' ? 'active' : ''}`}
              onClick={() => navigate('/auction-create')}
            >
              Create Auction
            </span>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role badge-role">{userRole}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
