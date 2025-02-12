const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addCommentToPhoto = async (req, res) => {
  try {
    const { id } = req.params; 
    const { IsiKomentar } = req.body; 
    const userId = req.user?.UserID; 

    if (!userId) {
      return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    const foto = await prisma.foto.findUnique({
      where: { FotoID: parseInt(id) },
    });

    if (!foto) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

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
    const { id } = req.params; 

    const foto = await prisma.foto.findUnique({
      where: { FotoID: parseInt(id) },
    });

    if (!foto) {
      return res.status(404).json({ error: 'Foto tidak ditemukan.' });
    }

 
    const komentar = await prisma.komentarFoto.findMany({
      where: { FotoID: parseInt(id) },
      include: {
        User: { select: { NamaLengkap: true, Username: true } }, 
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

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // KomentarID dari URL
    const userId = req.user?.UserID;

    if (!userId) {
      return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
    }

    const komentar = await prisma.komentarFoto.findUnique({
      where: { KomentarID: parseInt(id) },
    });

    if (!komentar) {
      return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
    }

    if (komentar.UserID !== userId) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk menghapus komentar ini.' });
    }

    await prisma.komentarFoto.delete({
      where: { KomentarID: parseInt(id) },
    });

    res.status(200).json({
      message: 'Komentar berhasil dihapus.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = { addCommentToPhoto, getCommentsByPhoto, deleteComment };