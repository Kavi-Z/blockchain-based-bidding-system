import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar2.css';
import logo from "../../assets/cryptops.png";

const Navbar2 = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
