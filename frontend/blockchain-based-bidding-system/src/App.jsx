import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bidder_Login from "./components/bidder_login/bidder_login";
import Signup from "./components/bidder_signup/signup";
import Landing from "./components/landing_page/landing";
import NFTGallery from "./components/NFT_page/nft";
import Main_Login from "./components/main_login/main_login";
import Upload from "./components/items-upload/upload";
import NFTDetail from "./components/NFTDetails/NFTDetails";
import Seller_dashboard from "./components/seller_dashboard/seller_dashboard";
import Update_profile from "./components/ProfilePage/ProfilePage";
import AuctionPage from "./components/auction_page/auction_page";
import SellerLogin from './components/seller_login/seller_login';
import SellerSignup from './components/seller_signup/seller_signup';
import Chatbot from "./components/chatbot/chatbot";
import BiddersDashboard from "./components/BidderDashboard/bidderdashboard.jsx";
import Documentation from "./components/documentation/documentation";
import Whitepaper from "./components/whitepaper/whitepaper";
import Community from "./components/community/community";
import Support from "./components/support/support";
import PrivacyPolicy from "./components/privacy-policy/privacy-policy";
import TermsOfService from "./components/terms-of-service/terms-of-service";
import CookiePolicy from "./components/cookie-policy/cookie-policy";
import Disclaimer from "./components/disclaimer/disclaimer";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/bidder_login" element={<Bidder_Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-nft" element={<NFTGallery />} />
        <Route path="/main-login" element={<Main_Login />} />
        <Route path="/upload" element={<Upload />} /> 
        <Route path="/nft/:id" element={<NFTDetail />} />
        <Route path="/seller_dashboard" element={<Seller_dashboard />} />
        <Route path="/profile" element={<Update_profile />} />
        <Route path="/auctions" element={<AuctionPage />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/seller-signup" element={<SellerSignup />} />
        <Route path="/bidder-dashboard" element={<BiddersDashboard />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/whitepaper" element={<Whitepaper />} />
        <Route path="/community" element={<Community />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

      </Routes>
 
      <Chatbot />
    </Router>
  );
}

export default App;
