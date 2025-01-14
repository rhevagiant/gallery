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
        Album: true, // Menyertakan informasi album
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
    const LokasiFile = req.file.path; // URL gambar dari Cloudinary
    const userId = req.user?.UserID;

    if (!userId) {
      return res.status(400).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    // Jika AlbumID tidak diberikan, cari album default
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

    // Buat entri baru untuk Foto
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


const updatePhotoAlbum = async (req, res) => {
  try {
    const { AlbumID, NamaAlbum, Deskripsi } = req.body;
    const FotoID = parseInt(req.params.id); // Mengambil FotoID dari parameter URL dan memastikan dalam format integer
    const userId = req.user?.UserID;

    if (!userId) {
      return res.status(400).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    // Cek apakah FotoID valid
    if (!FotoID) {
      return res.status(400).json({ error: 'FotoID tidak ditemukan.' });
    }

    // Cek apakah foto ada dan milik pengguna yang sedang login
    const foto = await prisma.foto.findUnique({
      where: { FotoID: FotoID },
    });

    if (!foto || foto.UserID !== userId) {
      return res.status(404).json({ error: 'Foto tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    // Jika NamaAlbum diberikan, buat album baru
    let targetAlbumID = AlbumID;
    if (NamaAlbum) {
      const newAlbum = await prisma.album.create({
        data: {
          NamaAlbum,
          Deskripsi: Deskripsi || null,
          UserID: userId,
        },
      });
      targetAlbumID = newAlbum.AlbumID;
    }

    // Update album foto
    const updatedPhoto = await prisma.foto.update({
      where: { FotoID: FotoID },
      data: { AlbumID: targetAlbumID },
    });

    res.status(200).json({
      message: 'Foto berhasil diperbarui.',
      data: updatedPhoto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = { createFoto, getAllPhotos, updatePhotoAlbum };
