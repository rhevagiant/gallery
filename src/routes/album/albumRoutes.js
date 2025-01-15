const express = require('express');
const { createAlbum, getAllAlbums, deleteAlbum, updateAlbum } = require('../../controller/album/albumController');
const userAuth = require('../../middleware/auth/authMiddleware');

const router = express.Router();

router.get('/allAlbum', userAuth, getAllAlbums);
router.post('/addAlbum', userAuth, createAlbum);
router.delete('/deleteAlbum/:id', userAuth, deleteAlbum);
router.put('/updateAlbum/:id', userAuth, updateAlbum);


module.exports = router;
