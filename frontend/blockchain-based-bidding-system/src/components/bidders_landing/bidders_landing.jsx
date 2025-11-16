import React, { useState } from 'react';
import './bidders_landing.css';
import backgroundImage from '../../assets/back_other.png';
import cryptopsLogo from '../../assets/cryptops.png';
import notificationIcon from '../../assets/noti.png';
import img3 from '../../assets/img3.png';
import img4 from '../../assets/img4.png';
import img5 from '../../assets/img5.png';

const BiddersLanding = () => {
  const [activeTab, setActiveTab] = useState('home');

  const auctionItems = [
    {
      id: 1,
      image: img3,
      floorPrice: '0.05 ETH',
      priceChange: '-20.18%',
      endTime: '45 min',
      changePositive: false
    },
    {
      id: 2,
      image: img4,
      floorPrice: '0.052 ETH',
      priceChange: '-40.25%',
      endTime: '1 min',
      changePositive: false
    },
    {
      id: 3,
      image: img5,
      floorPrice: '0.01 ETH',
      priceChange: '+31.85%',
      endTime: '26 min',
      changePositive: true
    }
  ];

  return (
    <div className="bidders-landing" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={cryptopsLogo} alt="CryptOps" className="logo-icon" />
          <span className="logo-text">CryptOps</span>
        </div>
        
        <div className="nav-center">
          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`nav-tab ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            FAQs
          </button>
        </div>
        
        <div className="nav-right">
          <button className="notification-btn">
            <img src={notificationIcon} alt="Notifications" className="notification-icon" />
          </button>
          <button className="connect-wallet-btn">
            CONNECT WALLET
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">ONGOING AUCTIONS</h1>
        
        <div className="collection-section">
          <h2 className="collection-name">MONKEY MASH</h2>
          
          <div className="auction-grid">
            {auctionItems.map((item) => (
              <div key={item.id} className="auction-card-wrapper">
                <div className="auction-card">
                  <div className="card-image-container">
                    <img src={item.image} alt="NFT" className="card-image" />
                  </div>
                  
                  <div className="card-details">
                    <div className="price-info">
                      <span className="price-text">Floor price {item.floorPrice}</span>
                      <span className={`price-change ${item.changePositive ? 'positive' : 'negative'}`}>
                        {item.priceChange}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="time-info-outside">
                  <span className="time-text">End in {item.endTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BiddersLanding;