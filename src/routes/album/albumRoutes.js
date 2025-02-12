const express = require('express');
const { createAlbum, getAllAlbums, deleteAlbum, updateAlbum, getAlbumByID } = require('../../controller/album/albumController');
const userAuth = require('../../middleware/auth/authMiddleware');

const router = express.Router();

router.get('/allAlbum', userAuth, getAllAlbums);
router.post('/createAlbum', userAuth, createAlbum);
router.get('/:id', userAuth, getAlbumByID);
router.delete('/deleteAlbum/:id', userAuth, deleteAlbum);
router.put('/updateAlbum/:id', userAuth, updateAlbum);


module.exports = router;
