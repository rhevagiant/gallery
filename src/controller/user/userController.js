const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createUser = async (req, res) => {
  const { username, email, password, namaLengkap } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const newUser = await prisma.user.create({
      data: {
        Username: username,
        Email: email,
        Password: hashedPassword,
        NamaLengkap: namaLengkap,
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("hallo",email,password);

  try {
    const user = await prisma.user.findUnique({ where: { Email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log('Menyimpan UserID ke sesi:', user.UserID);
    req.session.UserID = user.UserID;
    req.session.Username = user.Username;
    await req.session.save();


    console.log('Session setelah login:', req.session);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.Username,
        email: user.Email,
        nama: user.NamaLengkap,
      },
    });

    console.log('Session sesudah login:', req.session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal logout' });
    }
    res.status(200).json({ message: 'Logout berhasil' });
  });
};
