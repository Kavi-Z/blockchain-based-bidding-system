import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/login";
import Signup from "./components/Signup/signup";
import Landing from "./components/landing_page/landing";
import BiddersLanding from "./components/bidders_landing/bidders_landing";  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bidders_landing" element={<BiddersLanding />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;
