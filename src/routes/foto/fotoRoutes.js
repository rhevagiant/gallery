const express = require('express');
const { createFoto } = require('../../controller/foto/fotoController');
const upload = require('../../middleware/upload');

const router = express.Router();

router.post('/uploadFoto', upload.single('image'), createFoto);

// Tambahkan route lain

module.exports = router;
