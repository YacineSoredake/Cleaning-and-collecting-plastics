const express = require('express');
const { getSpot } = require('../controllers/spotController');
const router = express.Router();

router.get('/spot',getSpot);

module.exports = router;
