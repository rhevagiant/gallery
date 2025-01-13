const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Inisialisasi prisma

const userAuth = async (req, res, next) => {
  console.log('Session di middleware:', req.session); // Debugging
  if (req.session && req.session.UserID) {
    try {
      const user = await prisma.user.findUnique({ where: { UserID: req.session.UserID } });
      if (!user) {
        return res.status(401).json({ error: 'User tidak ditemukan. Silakan login kembali.' });
      }
      req.user = { UserID: user.UserID, Username: user.Username }; // Pasang informasi user di req
      next();
    } catch (error) {
      console.error('Terjadi kesalahan saat memverifikasi user:', error); 
      return res.status(500).json({ error: 'Terjadi kesalahan saat memverifikasi user.' });
    }
  } else {
    res.status(401).json({ error: 'Anda harus login untuk mengakses halaman ini.' });
  }
};

module.exports = userAuth;
