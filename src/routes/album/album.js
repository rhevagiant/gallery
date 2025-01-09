const express = require('express');
const { createAlbum } = require('../../controller/album/albumController');
const userAuth = require('../../middleware/auth/authMiddleware');

const router = express.Router();

// Hanya pengguna yang login yang bisa membuat album
router.post('/addAlbum', userAuth, createAlbum);

module.exports = router;
