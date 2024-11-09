const express = require('express');
const { addMarker,markers } = require('../controllers/marlerController');
const router = express.Router();
const { upload } = require('../middleware/updateFile');

router.post('/addMarker',upload.single('imageUrl'),addMarker);
router.get('/markers',markers);

module.exports = router;
