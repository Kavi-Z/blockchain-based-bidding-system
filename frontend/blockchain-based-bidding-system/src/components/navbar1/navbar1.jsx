import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar1.css';
import logo from "../../assets/cryptops.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });

        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("MetaMask connection error:", err);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setWalletAddress(accounts[0] || '');
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className='navbar-container'>
        <div className='navbar-logo'>
          <img src={logo} alt="CryptOps Logo" className='logo-img' />
          <span className='logo-text'>CryptOps</span>
        </div>

        <div className="navbar-buttons">
  <button 
    className='connect-wallet-btn'
    onClick={handleConnectWallet}>
    {walletAddress
      ? `${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}`
      : 'Connect Wallet'}
  </button>

    <button
      className='connect-wallet-btn profile-btn'
      onClick={() => navigate('/profile')}
    >
      Profile
    </button>

</div>

      </div>
    </nav>
  );
};

export default Navbar;
