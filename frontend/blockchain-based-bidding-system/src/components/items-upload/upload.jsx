import React, { useState, useEffect } from "react";
import loginBg from "../../assets/login.png";
import logo from "../../assets/cryptops.png";
import { Link } from "react-router-dom";
import "./upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    startingBid: "",
    bidIncrement: "",
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a JPEG or PNG file');
        return;
      }
      
      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateAuction = (event) => {
    event.preventDefault();
    if (selectedFile && formData.itemName && formData.startingBid && formData.bidIncrement && formData.startTime && formData.endTime) {
      // Handle auction creation logic here
      console.log("Creating auction with:", { ...formData, file: selectedFile });
      alert("Auction created successfully!");
    } else {
      alert("Please fill all fields and select an item image!");
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConnectWallet = () => {
    alert('Connecting wallet...');
  };

  return (
    <div
      className="upload-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
 
      <div className="upload-content">
        <div className="upload-box">
          <div className="upload-title">
            <span className="upload-main-text">Create Auction</span>
          </div>

          <form className="upload-form" onSubmit={handleCreateAuction}>
      
            <div className="form-group">
              <label className="form-label">Item Image</label>
              <div 
                className={`upload-area ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="file-selected">
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button"
                      className="remove-file"
                      onClick={() => setSelectedFile(null)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">📁</div>
                    <p className="upload-text">Drag and Drop the item</p>
                    <p className="upload-subtext">or</p>
                    <label className="file-input-label">
                      Click Add Item
                      <input
                        type="file"
                        accept=".jpeg,.jpg,.png"
                        onChange={handleFileSelect}
                        className="file-input"
                      />
                    </label>
                  </>
                )}
              </div>
              <div className="file-requirements">
                <p>Supported Format: jpeg/png</p>
                <p>Maximum Size: 5MB</p>
              </div>
            </div>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter item name"
                className="form-input"
                value={formData.itemName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Starting Bid */}
            <div className="form-group">
              <label className="form-label">Starting Bid</label>
              <input
                type="number"
                name="startingBid"
                placeholder="Enter starting bid amount"
                className="form-input"
                value={formData.startingBid}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Bid Increment */}
            <div className="form-group">
              <label className="form-label">Bid Increment</label>
              <input
                type="number"
                name="bidIncrement"
                placeholder="Enter bid increment amount"
                className="form-input"
                value={formData.bidIncrement}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Duration - Start Time */}
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Duration - End Time */}
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Wallet Address */}
            <div className="form-group">
              <label className="form-label">Wallet Address</label>
              <div className="wallet-address">
                <span className="wallet-text">Waltz:Oxav...5554</span>
                <button type="button" className="copy-btn">Copy</button>
              </div>
            </div>

            {/* Create Auction Button */}
            <div className="form-group">
              <button type="submit" className="create-auction-btn">
                Create Auction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;