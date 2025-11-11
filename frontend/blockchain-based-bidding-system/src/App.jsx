import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/login";
import Signup from "./components/Signup/signup";
import Landing from "./components/landing_page/landing";
import NFTGallery from "./components/NFT_page/nft";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/nft" element={<NFTGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
