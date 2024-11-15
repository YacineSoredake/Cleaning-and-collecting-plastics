const express = require('express');
const { getSpot, BorrowSpot, MySpots } = require('../controllers/spotController');
const router = express.Router();

router.get('/spot',getSpot);
router.put('/spot',BorrowSpot)
router.get('/myspots',MySpots)

module.exports = router;
