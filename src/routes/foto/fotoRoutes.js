const express = require('express');
const { createFoto, getAllPhotos, updatePhotoAlbum } = require('../../controller/foto/fotoController');
const upload = require('../../middleware/upload');
const userAuth = require('../../middleware/auth/authMiddleware')

const router = express.Router();

const authRoutes = express.Router();

router.get('/allPhotos', userAuth, getAllPhotos)
router.post('/uploadPhoto', upload.single('image'), userAuth, createFoto);
router.put('/editPhoto/:id', userAuth, updatePhotoAlbum);

authRoutes.use(userAuth);

module.exports = router;
