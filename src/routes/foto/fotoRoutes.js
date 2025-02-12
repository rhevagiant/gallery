const express = require('express');
const { createFoto, getAllPhotos, deletePhoto } = require('../../controller/foto/fotoController');
const upload = require('../../middleware/upload');
const userAuth = require('../../middleware/auth/authMiddleware');
const { addCommentToPhoto, getCommentsByPhoto, deleteComment } = require('../../controller/komentar/komentarController');
const { likePhoto, getLikesByPhoto, getLikedPhotos } = require('../../controller/like/likeController');

const router = express.Router();

const authRoutes = express.Router();

router.get('/allPhotos', userAuth, getAllPhotos)
router.post('/uploadPhoto', upload.single('image'), userAuth, createFoto);
router.delete('/deletePhoto/:id', userAuth, deletePhoto);

//komentar
router.post('/:id/addComment', userAuth, addCommentToPhoto); //inimah pake id foto
router.get('/:id/allComments', userAuth, getCommentsByPhoto); //ini jg
router.delete('/:id/deleteComment', userAuth, deleteComment); //id nya si komentar, bukan foto

//like
router.post('/:id/like', userAuth, likePhoto);
router.get('/:id/allLikes', userAuth, getLikesByPhoto);
router.get('/liked-photos', userAuth, getLikedPhotos);

authRoutes.use(userAuth);

module.exports = router;
