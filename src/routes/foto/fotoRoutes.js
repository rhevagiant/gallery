const express = require('express');
const { createFoto, getAllPhotos, deletePhoto } = require('../../controller/foto/fotoController');
const upload = require('../../middleware/upload');
const userAuth = require('../../middleware/auth/authMiddleware')

const router = express.Router();

const authRoutes = express.Router();

router.get('/allPhotos', userAuth, getAllPhotos)
router.post('/uploadPhoto', upload.single('image'), userAuth, createFoto);
router.delete('/deletePhoto/:id', userAuth, deletePhoto);


authRoutes.use(userAuth);

module.exports = router;
