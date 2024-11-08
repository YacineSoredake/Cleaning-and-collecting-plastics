const express = require('express');
const { addMarker,markers } = require('../controllers/marlerController');
const router = express.Router();

router.post('/addMarker',addMarker);
router.get('/markers',markers);

module.exports = router;
