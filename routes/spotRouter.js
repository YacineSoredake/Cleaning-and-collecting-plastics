const express = require('express');
const { getSpot, BorrowSpot } = require('../controllers/spotController');
const router = express.Router();

router.get('/spot',getSpot);
router.put('/spot',BorrowSpot)

module.exports = router;
