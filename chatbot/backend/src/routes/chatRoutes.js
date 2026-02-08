const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Main chat message endpoint
router.post('/message', chatController.handleMessage);

// Get live auction status
router.get('/auction-status', chatController.getAuctionStatus);

module.exports = router;
