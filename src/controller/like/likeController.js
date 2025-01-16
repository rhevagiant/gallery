const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likePhoto = async (req, res) => {
    try {
      const { id } = req.params; // FotoID dari URL
      const userId = req.user?.UserID;
  
      if (!userId) {
        return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
      }
  
      // Cek apakah foto ada
      const foto = await prisma.foto.findUnique({
        where: { FotoID: parseInt(id) },
      });
  
      if (!foto) {
        return res.status(404).json({ error: 'Foto tidak ditemukan.' });
      }
  
      // Cek apakah user sudah pernah memberi like pada foto ini
      const existingLike = await prisma.likeFoto.findFirst({
        where: {
          FotoID: parseInt(id),
          UserID: userId,
        },
      });
  
      if (existingLike) {
        // Jika sudah di-like, hapus like (unlike)
        await prisma.likeFoto.delete({
          where: { LikeID: existingLike.LikeID },
        });
  
        return res.status(200).json({
          message: 'Like berhasil dihapus.',
        });
      }
  
      // Jika belum di-like, tambahkan like
      await prisma.likeFoto.create({
        data: {
          FotoID: parseInt(id),
          UserID: userId,
          TanggalLike: new Date(),
        },
      });
  
      res.status(200).json({
        message: 'Foto berhasil di-like.',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getLikesByPhoto = async (req, res) => {
    try {
      const { id } = req.params; // FotoID dari URL
  
      // Cek jumlah like pada foto
      const likeCount = await prisma.likeFoto.count({
        where: { FotoID: parseInt(id) },
      });
  
      res.status(200).json({
        message: 'Jumlah like berhasil diambil.',
        data: { likeCount },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
module.exports={ likePhoto, getLikesByPhoto };