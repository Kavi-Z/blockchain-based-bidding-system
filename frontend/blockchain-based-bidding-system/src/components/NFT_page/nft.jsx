import React, { useState } from 'react';
import { ArrowLeft, Bell, ArrowRight } from 'lucide-react'; // added ArrowRight
import './nft.css';
import '../../assets/fonts/fonts.css';
import Navbar from '../navbar1/navbar1';
import Footer from '../footer/footer';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img6.jpg';
import img3 from '../../assets/img7.jpg';
import img4 from '../../assets/img8.jpg';
import img5 from '../../assets/img9.jpg';
import backImg from '../../assets/img10.jpg';
const img6 = backImg; // fallback image

const NFTGallery = () => {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25);

  // centralised goBack handler — ensures detail -> gallery works and scrolls to top
  const goToGallery = () => {
    setSelectedNFT(null);
    // scroll to top so gallery is visible (useful if detail view scrolled)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // NFT Data - use imported images
  const nfts = [
    { id: 1, name: "Monkey Mash", image: img1, bgClass: "nft-bg-green", owner: "0xbdf...5554", topOffer: "0.0161", floorPrice: "0.0175", lastSale: "0.0179", buyPrice: "0.0175", discount: "66.25%" },
    { id: 2, name: "Pink Ape Club", image: img2, bgClass: "nft-bg-pink", owner: "0xabc...1234", topOffer: "0.0145", floorPrice: "0.0160", lastSale: "0.0155", buyPrice: "0.0160", discount: "55.50%" },
    { id: 3, name: "Cool Chimp", image: img3, bgClass: "nft-bg-orange", owner: "0xdef...7890", topOffer: "0.0180", floorPrice: "0.0195", lastSale: "0.0190", buyPrice: "0.0195", discount: "70.15%" },
    { id: 4, name: "Teal Bear", image: img4, bgClass: "nft-bg-teal", owner: "0xghi...4567", topOffer: "0.0125", floorPrice: "0.0140", lastSale: "0.0138", buyPrice: "0.0140", discount: "48.30%" },
    { id: 5, name: "Cyber Punk", image: img5, bgClass: "nft-bg-red", owner: "0xjkl...9012", topOffer: "0.0200", floorPrice: "0.0220", lastSale: "0.0215", buyPrice: "0.0220", discount: "82.40%" },
    { id: 6, name: "Lakers Bear", image: img6, bgClass: "nft-bg-purple", owner: "0xmno...3456", topOffer: "0.0155", floorPrice: "0.0170", lastSale: "0.0165", buyPrice: "0.0170", discount: "60.75%" }
  ];

  const getRelatedNFTs = (currentId) => {
    return nfts.filter(nft => nft.id !== currentId).slice(0, 4);
  };

  // Gallery View Component
  const GalleryView = () => (
    <div className="app-container">
      <Navbar />

      {/* Page Title: click goes to gallery (no-op when already there) */}
      <h1 className="page-title" onClick={goToGallery} role="button" tabIndex={0}>
        MY ASSETS
      </h1>

      {/* NFT Grid */}
      <div className="nft-grid">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            onClick={() => setSelectedNFT(nft)}
            className="nft-card"
            role="button"
            tabIndex={0}
          >
            <div className={`nft-image-wrapper ${nft.bgClass}`}>
              <img src={nft.image} alt={nft.name} className="nft-image" />
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );

  // Detail View Component
  const DetailView = ({ nft }) => {
    const relatedNFTs = getRelatedNFTs(nft.id);

    return (
      <div className="app-container">
        <Navbar />

        {/* ensure the back button uses the same handler and is visible/clickable */}
        <div className="detail-top">
          <button type="button" onClick={goToGallery} className="back-btn">
            <ArrowLeft className="back-icon" />
            Back to Gallery
          </button>
        </div>

        {/* Detail Grid */}
        <div className="detail-grid">
          {/* Left Side - NFT Image */}
          <div className="detail-left">
            <h1 className="detail-title">{nft.name}</h1>
            <div className={`detail-image-wrapper ${nft.bgClass}`}>
              <img
                src={nft.image}
                alt={nft.name}
                className="detail-image"
              />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="detail-right">
            <div className="owner-text">
              Owned by {nft.owner}
            </div>

            {/* Stats Card */}
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

              {/* Buy Section */}
              <div className="buy-section">
                <div className="buy-header">
                  <span className="buy-label">BUY FOR</span> {/* changed */}
                  <div className="buy-price-container">
                    <div className="buy-price">{nft.buyPrice} ETH</div>
                    <div className="buy-discount">({nft.discount})</div>
                  </div>
                </div>
                <div className="timer-text">End in {timeLeft} min</div>
                <button className="buy-btn">Buy Now</button>
              </div>
            </div>

            {/* Related NFTs Section */}
            <div className="related-section">
              <div className="related-header">
                <h3 className="related-title">More from this collection</h3>
                {/* replaced text arrow with lucide ArrowRight icon */}
                <button className="related-arrow" type="button" aria-label="Next in collection">
                  <ArrowRight className="related-arrow-icon" />
                </button>
              </div>
              <div className="related-grid">
                {relatedNFTs.map((relatedNFT) => (
                  <div
                    key={relatedNFT.id}
                    onClick={() => setSelectedNFT(relatedNFT)}
                    className="related-card"
                  >
                    <div className={`related-image-wrapper ${relatedNFT.bgClass}`}>
                      <img
                        src={relatedNFT.image}
                        alt={relatedNFT.name}
                        className="related-image"
                      />
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

  // Main Render
  return selectedNFT ? <DetailView nft={selectedNFT} /> : <GalleryView />;
};

export default NFTGallery;