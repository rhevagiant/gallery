const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createFoto = async (req, res) => {
  try {
    const { JudulFoto, DeskripsiFoto } = req.body;
    const LokasiFile = req.file.path; // URL gambar dari Cloudinary

    // Ambil UserID dari pengguna yang sedang login (misalnya via JWT token)
    const userId = req.user?.UserID; // Pastikan middleware otentikasi menyisipkan `req.user`

    if (!userId) {
      return res.status(400).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    // Cari Album default milik user
    const album = await prisma.album.findFirst({
      where: { UserID: userId },
      orderBy: { TanggalDibuat: 'asc' }, // Contoh, gunakan album pertama sebagai default
    });

    if (!album) {
      return res.status(400).json({ error: 'Album tidak ditemukan untuk user ini.' });
    }

    // Buat entri baru untuk Foto
    const foto = await prisma.foto.create({
      data: {
        JudulFoto,
        DeskripsiFoto,
        TanggalUnggah: new Date(),
        LokasiFile,
        AlbumID: album.AlbumID, // Ambil dari album default
        UserID: userId, // Ambil dari user yang login
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

module.exports = { createFoto };
