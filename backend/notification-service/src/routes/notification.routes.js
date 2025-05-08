const express = require('express');
const router = express.Router();
const { publishNotification } = require('../controllers/notification.controller');

// Route to publish a notification
router.post('/publish', publishNotification);

module.exports = router; 