const express = require('express');
const router = express.Router();
const { getMenuImages } = require('../controllers/menuImageController');

// Public endpoint – no auth required (used by customer-facing menu page)
router.get('/', getMenuImages);

module.exports = router;
