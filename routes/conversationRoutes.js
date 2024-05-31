const express = require('express');
const authController = require('../controllers/authController');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, conversationController.testRoute)
  .post(authController.protect, conversationController.makeQuestion);

module.exports = router;
