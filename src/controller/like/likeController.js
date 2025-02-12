const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likePhoto = async (req, res) => {
    try {
      const { id } = req.params; 
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
  
      const existingLike = await prisma.likeFoto.findFirst({
        where: {
          FotoID: parseInt(id),
          UserID: userId,
        },
      });
  
      if (existingLike) {
        await prisma.likeFoto.delete({
          where: { LikeID: existingLike.LikeID },
        });
  
        return res.status(200).json({
          message: 'Like berhasil dihapus.',
        });
      }
  
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
      const { id } = req.params; 
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

  const getLikedPhotos = async (req, res) => {
    try {
        const userId = req.user?.UserID;

        if (!userId) {
            return res.status(401).json({ error: 'UserID tidak ditemukan. Pastikan Anda login.' });
        }

        const likedPhotos = await prisma.likeFoto.findMany({
            where: { UserID: userId },
            include: {
                Foto: true, // Mengambil data foto yang di-like
            },
        });

        res.status(200).json({
            message: 'Foto yang di-like berhasil diambil.',
            data: likedPhotos.map(like => like.Foto),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
  
module.exports={ likePhoto, getLikesByPhoto, getLikedPhotos };