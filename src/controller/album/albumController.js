const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAlbum = async (req, res) => {
  try {
    console.log('User dari middleware:', req.user); // Log user dari middleware
    const { NamaAlbum, Deskripsi } = req.body;
    const userId = req.user?.UserID;

    if (!userId) {
      return res.status(400).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    const album = await prisma.album.create({
      data: {
        NamaAlbum,
        Deskripsi: Deskripsi || null,
        TanggalDibuat: new Date(),
        UserID: userId,
      },
    });

    res.status(201).json({
      message: 'Album berhasil dibuat.',
      data: album,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        User: {
          select: { NamaLengkap: true }, // Menampilkan nama pemilik album
        },
      },
    });

    res.status(200).json({
      message: 'Semua album berhasil diambil.',
      data: albums,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { createAlbum, getAllAlbums };
