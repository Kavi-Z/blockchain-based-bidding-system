import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/login";

import Signup from "./components/signup/signup";

import Signup from "./components/Signup/signup";
import Landing from "./components/landing_page/landing";
import Upload from './components/Upload/Upload';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        <Route path="/upload" element={<Upload />} />

      </Routes>
    </Router>
  );
}

export default App;
