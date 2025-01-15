const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPhotos = async (req, res) => {
  try {
    const userId = req.user?.UserID;

    if (!userId) {
      return res.status(400).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    const photos = await prisma.foto.findMany({
      where: { UserID: userId },
      include: {
        Album: true, 
      },
    });

    res.status(200).json({
      message: 'Semua foto berhasil diambil.',
      data: photos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFoto = async (req, res) => {
  try {
    const { JudulFoto, DeskripsiFoto, AlbumID } = req.body;
    const LokasiFile = req.file.path; 
    const userId = req.user?.UserID;

    if (!userId) {
      return res.status(400).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    let albumIdToUse = AlbumID;

    if (!AlbumID) {
      const defaultAlbum = await prisma.album.findFirst({
        where: { UserID: userId },
        orderBy: { TanggalDibuat: 'asc' },
      });

      if (!defaultAlbum) {
        return res.status(400).json({ error: 'Album tidak ditemukan untuk user ini.' });
      }

      albumIdToUse = defaultAlbum.AlbumID;
    }

    const foto = await prisma.foto.create({
      data: {
        JudulFoto,
        DeskripsiFoto,
        TanggalUnggah: new Date(),
        LokasiFile,
        AlbumID: parseInt(albumIdToUse),
        UserID: userId,
      },
    });

    res.status(201).json({
      message: 'Foto berhasil diupload',
      data: foto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user?.UserID; 

    if (!userId) {
      return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    const foto = await prisma.foto.findUnique({
      where: { FotoID: parseInt(id) },
    });

    if (!foto || foto.UserID !== userId) {
      return res.status(404).json({ error: 'Foto tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    await prisma.foto.delete({
      where: { FotoID: parseInt(id) },
    });

    res.status(200).json({ message: 'Foto berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { createFoto, getAllPhotos, deletePhoto };
