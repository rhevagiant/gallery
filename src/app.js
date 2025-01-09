const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/userRoutes');
const FotoRouter = require('./routes/foto/fotoRoutes')

const app = express();

app.use(bodyParser.json());

// API routes
app.use('/users', userRoutes);
app.use('/foto', FotoRouter);
app.use(
    session({
      secret: '11223344', // Ganti dengan secret yang aman
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Cookie berlaku selama 1 hari
    })
  );
module.exports = app;
