import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bidder_Login from "./components/Login/bidder_login";
import Signup from "./components/Signup/signup";
import Landing from "./components/landing_page/landing";
import NFTGallery from "./components/NFT_page/nft";
import Main_Login from "./components/main_login/main_login";
import Upload from "./components/items-upload/upload";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/bidder_login" element={<Bidder_Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/nft" element={<NFTGallery />} />
        <Route path="/main-login" element={<Main_Login />} />
        <Route path="/upload" element = {<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;
