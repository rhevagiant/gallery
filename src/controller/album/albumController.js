const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAlbum = async (req, res) => {
  try {
    const { NamaAlbum, Deskripsi } = req.body;

    // Ambil UserID dari middleware autentikasi
    const userId = req.user?.UserID; // Pastikan middleware autentikasi menyisipkan `req.user`

    if (!userId) {
      return res.status(400).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    // Buat album baru
    const album = await prisma.album.create({
      data: {
        NamaAlbum,
        Deskripsi: Deskripsi || null, // Jika tidak ada deskripsi, set null
        TanggalDibuat: new Date(),
        UserID: userId, // Kaitkan album dengan UserID
      },
    });

    res.status(201).json({
      message: 'Album berhasil dibuat',
      data: album,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAlbum };
