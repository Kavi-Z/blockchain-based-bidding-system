import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auction_page.css';

const AuctionPage = () => {
  const [auctions] = useState([
    {
      id: 1,
      image: 'https://i.seadn.io/gae/LIov33kogXOK4XZd2ESj29sqm_Hww5JSdO7AFn5wjt8xgnJJ0UpNV9yITqxra3s_LMEW1AnnrgOVB_hDpjJRA1uF4skI5Sdi_9rULi8?auto=format&dpr=1&w=384',
      floorPrice: '0.05',
      priceChange: '-20.95%',
      changeType: 'negative',
      endTime: '45 min',
      status: 'active'
    },
    {
      id: 2,
      image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=384',
      floorPrice: '0.052',
      priceChange: '+0.28%',
      changeType: 'positive',
      endTime: null,
      status: 'ended'
    },
    {
      id: 3,
      image: 'https://i.seadn.io/gae/nKtGrmFLM_9vSogFbQTOAi5Vp8nJz_cXLdSq3d6nDr8pqcN_7qBIp-3xPvX5CqrPZ2DRhxBFpF6aYQcQxE_9nMkV_TjRAFcVDqYqGg?auto=format&dpr=1&w=384',
      floorPrice: '0.01',
      priceChange: '+41.5%',
      changeType: 'positive',
      endTime: '25 min',
      status: 'active'
    }
  ]);

  const [userId] = useState('0xbaf....5554');
  const navigate = useNavigate();

  const handleCreateAuction = () => {
    navigate('/upload');
  };

  return (
    <div className="auction-page">
      <div className="auction-navbar">
        <div className="auction-navbar-content">
          <h2 className="auction-logo">CryptOps</h2>
          <button className="auction-connect-btn" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </div>
      <div className="auction-content">
        <div className="auction-header">
          <h1>Your Auctions</h1>
          <p className="user-id">Your id {userId}</p>
        </div>

        <div className="auctions-grid">
          {auctions.map((auction) => (
            <div key={auction.id} className="auction-card">
              <div className="auction-image-container">
                <img src={auction.image} alt="NFT Auction" className="auction-image" />
              </div>
              <div className="auction-details">
                <div className="price-info">
                  <span className="price-label">Floor price</span>
                  <span className="price-value">{auction.floorPrice} ETH</span>
                  <span className={`price-change ${auction.changeType}`}>
                    {auction.priceChange}
                  </span>
                </div>
                {auction.status === 'active' ? (
                  <p className="auction-time">End in {auction.endTime}</p>
                ) : (
                  <p className="auction-ended">Auction has Ended</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="create-auction-btn" onClick={handleCreateAuction}>
          Create An Auction
        </button>
      </div>
    </div>
  );
};

export default AuctionPage;
