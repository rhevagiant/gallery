const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addCommentToPhoto = async (req, res) => {
  try {
    const { id } = req.params; // FotoID dari URL
    const { IsiKomentar } = req.body; // Isi komentar dari body
    const userId = req.user?.UserID; // UserID dari session/login

    if (!userId) {
      return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    // Pastikan FotoID valid dan ada di database
    const foto = await prisma.foto.findUnique({
      where: { FotoID: parseInt(id) },
    });

    if (!foto) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

    // Tambahkan komentar ke foto
    const komentar = await prisma.komentarFoto.create({
      data: {
        FotoID: parseInt(id),
        UserID: userId,
        IsiKomentar,
        TanggalKomentar: new Date(),
      },
    });

    res.status(201).json({
      message: 'Komentar berhasil ditambahkan.',
      data: komentar,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getCommentsByPhoto = async (req, res) => {
  try {
    const { id } = req.params; // FotoID dari URL

    // Pastikan FotoID valid dan foto ada di database
    const foto = await prisma.foto.findUnique({
      where: { FotoID: parseInt(id) },
    });

    if (!foto) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

    // Ambil komentar terkait dengan FotoID
    const komentar = await prisma.komentarFoto.findMany({
      where: { FotoID: parseInt(id) },
      include: {
        User: { select: { NamaLengkap: true, Username: true } }, // Menampilkan nama user yang berkomentar
      },
    });

    res.status(200).json({
      message: 'Komentar berhasil diambil.',
      data: komentar,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { addCommentToPhoto, getCommentsByPhoto };