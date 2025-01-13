// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/userRoutes');
const fotoRoutes = require('./routes/foto/fotoRoutes');
const { createAlbum } = require('./controller/album/albumController');
const userAuth = require('./middleware/auth/authMiddleware');

const app = express();

// Middleware untuk parsing body
app.use(bodyParser.json());

// Middleware untuk session
app.use(
  session({
    secret: '11223344', // Ganti dengan secret yang aman
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Cookie berlaku selama 1 hari
  })
);

app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

// Routes
app.use('/users', userRoutes);
app.use('/foto', fotoRoutes);
app.use('/album', createAlbum);

app.use(userAuth); 

module.exports = app;
