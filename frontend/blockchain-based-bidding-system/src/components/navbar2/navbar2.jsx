import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from "@asgardeo/auth-react";
import './navbar2.css';
import logo from "../../assets/cryptops.png";

const Navbar2 = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state, signIn, signOut } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { 
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
    
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
       
      navigate(`/#${sectionId}`);
    }
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

        {state.isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: 'white' }}>{state.displayName || state.username || "User"}</span>
            <button className='connect-wallet-btn' onClick={() => signOut()}>
              Logout
            </button>
          </div>
        ) : (
          <button className='connect-wallet-btn' onClick={() => signIn()}>
            Sign In with Asgardeo
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar2;
