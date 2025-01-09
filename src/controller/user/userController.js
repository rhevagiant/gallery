const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const session = require('express-session');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, email, password, nama } = req.body;
  try {
    // Cek apakah email sudah ada di database
    const existingUser = await prisma.user.findUnique({
      where: { Email: email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Buat pengguna baru
    const newUser = await prisma.user.create({
      data: { 
        Username: username,
        Email: email,
        Password: password,
        NamaLengkap: nama
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Destruktur input dari request body

  try {
    // Periksa apakah pengguna dengan email yang diberikan ada di database
    const user = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });

    if (!user) {
      // Jika pengguna tidak ditemukan, kirim respon 404
      return res.status(404).json({ message: "User not found" });
    }

    // Verifikasi password (gunakan hashing pada password untuk keamanan di aplikasi nyata)
    if (user.Password !== password) {
      // Jika password tidak cocok, kirim respon 401
      return res.status(401).json({ message: "Invalid password" });
    }

    // Jika email dan password cocok, kirim respon sukses
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.Username,
        email: user.Email,
        nama: user.NamaLengkap,
      },
    });
  } catch (error) {
    // Tangani error lainnya
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal logout' }); // Hentikan eksekusi lebih lanjut dengan return
    }
    // Jika logout berhasil, kirimkan respons dan hentikan eksekusi lebih lanjut
    return res.status(200).json({ message: 'Logout berhasil' });
  });
};
  
  
