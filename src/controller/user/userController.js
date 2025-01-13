const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

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
    const existingUser = await prisma.user.findUnique({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        Username: username,
        Email: email,
        Password: hashedPassword,
        NamaLengkap: nama,
      },
    });
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

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


// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal logout' });
    }
    res.status(200).json({ message: 'Logout berhasil' });
  });
};
