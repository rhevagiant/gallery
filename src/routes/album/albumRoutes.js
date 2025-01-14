const express = require('express');
const { createAlbum, getAllAlbums } = require('../../controller/album/albumController');
const userAuth = require('../../middleware/auth/authMiddleware');

const router = express.Router();

const authRoutes = express.Router();

router.get('/allAlbum', getAllAlbums);
router.post('/addAlbum', userAuth, createAlbum);

authRoutes.use(userAuth);

module.exports = router;
