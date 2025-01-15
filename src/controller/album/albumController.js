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

const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user?.UserID; 

    if (!userId) {
      return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    const album = await prisma.album.findUnique({
      where: { AlbumID: parseInt(id) },
    });

    if (!album || album.UserID !== userId) {
      return res.status(404).json({ error: 'Album tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    await prisma.foto.deleteMany({
      where: { AlbumID: parseInt(id) },
    });

    await prisma.album.delete({
      where: { AlbumID: parseInt(id) },
    });

    res.status(200).json({ message: 'Album berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params; 
    const { NamaAlbum, Deskripsi } = req.body;
    const userId = req.user?.UserID; 

    if (!userId) {
      return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    // Cari album berdasarkan AlbumID dan UserID
    const album = await prisma.album.findUnique({
      where: { AlbumID: parseInt(id) },
    });

    if (!album || album.UserID !== userId) {
      return res.status(404).json({ error: 'Album tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    // Update album
    const updatedAlbum = await prisma.album.update({
      where: { AlbumID: parseInt(id) },
      data: {
        NamaAlbum: NamaAlbum || album.NamaAlbum,
        Deskripsi: Deskripsi || album.Deskripsi,
      },
    });

    res.status(200).json({
      message: 'Album berhasil diperbarui.',
      data: updatedAlbum,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = { createAlbum, getAllAlbums, deleteAlbum, updateAlbum };
