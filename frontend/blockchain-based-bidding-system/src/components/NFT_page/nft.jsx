import React from 'react';
import './nft.css';
import '../../assets/fonts/fonts.css';
import Navbar from '../navbar1/navbar1';
import Footer from '../footer/footer';
import { useNavigate } from 'react-router-dom';

import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img6.jpg';
import img3 from '../../assets/img7.jpg';
import img4 from '../../assets/img8.jpg';
import img5 from '../../assets/img9.jpg';
import img6 from '../../assets/img10.jpg';

const NFTGallery = () => {
  const navigate = useNavigate();

  const nfts = [
    { id: 1, name: "Monkey Mash", image: img1, bgClass: "nft-bg-green" },
    { id: 2, name: "Pink Ape Club", image: img2, bgClass: "nft-bg-pink" },
    { id: 3, name: "Cool Chimp", image: img3, bgClass: "nft-bg-orange" },
    { id: 4, name: "Teal Bear", image: img4, bgClass: "nft-bg-teal" },
    { id: 5, name: "Cyber Punk", image: img5, bgClass: "nft-bg-red" },
    { id: 6, name: "Lakers Bear", image: img6, bgClass: "nft-bg-purple" }
  ];

  const goToDetail = (nft) => {
    // Navigate to detail page with NFT id
    navigate(`/nft/${nft.id}`);
  };

  return (
    <div className="app-container">
      <Navbar />
      <h1 className="page-title">Ongoing Auctions</h1>

      <div className="nft-grid">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            onClick={() => goToDetail(nft)}
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
};

export default NFTGallery;
