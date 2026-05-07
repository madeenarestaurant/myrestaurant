const express = require('express');
const router = express.Router();
const { getMenuImages } = require('../controllers/menuImageController');

router.get('/', getMenuImages);

module.exports = router;
