const express = require('express');
const { createAlbum, getAllAlbums } = require('../../controller/album/albumController');
const userAuth = require('../../middleware/auth/authMiddleware');

const router = express.Router();

router.get('/allAlbum', userAuth, getAllAlbums);
router.post('/addAlbum', userAuth, createAlbum);


module.exports = router;
