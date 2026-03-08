import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoHeader.css';
import logo from "../../assets/cryptops.png";

const LogoHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => { //pr,finance,logis
    navigate('/');
  };

  return (
    <header className={`logo-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className='logo-header-container'>
        <div className='logo-header-logo' onClick={handleLogoClick}>
          <img src={logo} alt="CryptOps Logo" className='logo-img' />
          <span className='logo-text'>CryptOps</span>
        </div>
      </div>
    </header>
  );
};

export default LogoHeader;