const express = require('express');
const { getSpot, BorrowSpot, MySpots ,bookedSpt ,cancelBook , claimSpot} = require('../controllers/spotController');
const router = express.Router();
const {verifyAccessToken} = require('../middleware/jwtUtils')

// add verify acces token to all route and make sure when you fetch any api 
// send the url with authetification header bearer tokenacess 

router.get('/spot',getSpot);
router.put('/spot',BorrowSpot)
router.get('/myspots',MySpots)
router.get('/booked',bookedSpt)
router.put('/cancel',cancelBook)
router.put('/claim',claimSpot)

module.exports = router;
