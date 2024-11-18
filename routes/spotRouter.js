const express = require('express');
const { getSpot, BorrowSpot, MySpots ,bookedSpt } = require('../controllers/spotController');
const router = express.Router();

router.get('/spot',getSpot);
router.put('/spot',BorrowSpot)
router.get('/myspots',MySpots)
router.get('/booked',bookedSpt)

module.exports = router;
