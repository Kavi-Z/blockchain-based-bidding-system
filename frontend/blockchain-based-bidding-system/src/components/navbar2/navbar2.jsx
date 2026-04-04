import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar2.css';
import logo from "../../assets/cryptops.png";

const Navbar2 = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Handle scrolling to section when landing page loads with hash
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const scrollToSection = (sectionId) => {
    // If we're on the landing page, scroll directly
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to landing page with hash
      navigate(`/#${sectionId}`);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/main-login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className='navbar-container'>
        <div className='navbar-logo'>
          <img src={logo} alt="CryptOps Logo" className='logo-img' />
          <span  className='logo-text'>CryptOps </span>
        </div>

        <ul className='navbar-menu'>
          <li className='navbar-item'>
            <a onClick={() => scrollToSection('home')} className='navbar-link'>Home</a>
          </li>
          <li className='navbar-item'>
            <a onClick={() => scrollToSection('about')} className='navbar-link'>About Us</a>
          </li>
          <li className='navbar-item'>
            <a onClick={() => scrollToSection('faq')} className='navbar-link'>FAQ’s</a>
          </li>
          <li className='navbar-item'>
            <a onClick={() => scrollToSection('contact')} className='navbar-link'>Contact</a>
          </li>
        </ul>

        <button className='connect-wallet-btn' onClick={handleLoginRedirect}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar2;
