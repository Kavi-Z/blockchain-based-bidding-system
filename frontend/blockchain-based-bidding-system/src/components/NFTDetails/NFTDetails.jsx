import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar1/navbar1';
import Footer from '../footer/footer';

import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img6.jpg';
import img3 from '../../assets/img7.jpg';
import img4 from '../../assets/img8.jpg';
import img5 from '../../assets/img9.jpg';
import img6 from '../../assets/img10.jpg';
import { ArrowLeft, ArrowRight } from 'react-feather';

const NFTDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const nfts = [
    { id: 1, name: "Monkey Mash", image: img1, bgClass: "nft-bg-green", owner: "0xbdf...5554", topOffer: "0.0161", floorPrice: "0.0175", lastSale: "0.0179", buyPrice: "0.0175", discount: "66.25%" },
    { id: 2, name: "Pink Ape Club", image: img2, bgClass: "nft-bg-pink", owner: "0xabc...1234", topOffer: "0.0145", floorPrice: "0.0160", lastSale: "0.0155", buyPrice: "0.0160", discount: "55.50%" },
    { id: 3, name: "Cool Chimp", image: img3, bgClass: "nft-bg-orange", owner: "0xdef...7890", topOffer: "0.0180", floorPrice: "0.0195", lastSale: "0.0190", buyPrice: "0.0195", discount: "70.15%" },
    { id: 4, name: "Teal Bear", image: img4, bgClass: "nft-bg-teal", owner: "0xghi...4567", topOffer: "0.0125", floorPrice: "0.0140", lastSale: "0.0138", buyPrice: "0.0140", discount: "48.30%" },
    { id: 5, name: "Cyber Punk", image: img5, bgClass: "nft-bg-red", owner: "0xjkl...9012", topOffer: "0.0200", floorPrice: "0.0220", lastSale: "0.0215", buyPrice: "0.0220", discount: "82.40%" },
    { id: 6, name: "Lakers Bear", image: img6, bgClass: "nft-bg-purple", owner: "0xmno...3456", topOffer: "0.0155", floorPrice: "0.0170", lastSale: "0.0165", buyPrice: "0.0170", discount: "60.75%" }
  ];

  const nft = nfts.find(n => n.id === parseInt(id));
  if (!nft) return <div>NFT not found</div>;

  const relatedNFTs = nfts.filter(n => n.id !== nft.id).slice(0, 4);

  const goBack = () => navigate('/my-nft');

  return (
    <div className="app-container">
      <Navbar />

      <div className="detail-top">
        <button type="button" onClick={goBack} className="back-btn">
          <ArrowLeft className="back-icon" />
          Back to Gallery
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-left">
          <h1 className="detail-title">{nft.name}</h1>
          <div className={`detail-image-wrapper ${nft.bgClass}`}>
            <img src={nft.image} alt={nft.name} className="detail-image" />
          </div>
        </div>

        <div className="detail-right">
          <div className="owner-text">Owned by {nft.owner}</div>

          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Top offer</div>
                <div className="stat-value">{nft.topOffer} ETH</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Collection Floor</div>
                <div className="stat-value">{nft.floorPrice} ETH</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Last Sale</div>
                <div className="stat-value">{nft.lastSale} ETH</div>
              </div>
            </div>

            <div className="buy-section">
              <div className="buy-header">
                <span className="buy-label">BUY FOR</span>
                <div className="buy-price-container">
                  <div className="buy-price">{nft.buyPrice} ETH</div>
                  <div className="buy-discount">({nft.discount})</div>
                </div>
              </div>
              <div className="timer-text">End in 25 min</div>
              <button className="buy-btn">Buy Now</button>
            </div>
          </div>

          <div className="related-section">
            <div className="related-header">
              <h3 className="related-title">More from this collection</h3>
              <button className="related-arrow" type="button" aria-label="Next in collection">
                <ArrowRight className="related-arrow-icon" />
              </button>
            </div>
            <div className="related-grid">
              {relatedNFTs.map((relatedNFT) => (
                <div
                  key={relatedNFT.id}
                  onClick={() => navigate(`/nft/${relatedNFT.id}`)}
                  className="related-card"
                >
                  <div className={`related-image-wrapper ${relatedNFT.bgClass}`}>
                    <img src={relatedNFT.image} alt={relatedNFT.name} className="related-image" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NFTDetail;
