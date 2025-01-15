const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/userRoutes');
const fotoRoutes = require('./routes/foto/fotoRoutes');
const albumRoutes = require('./routes/album/albumRoutes');
// const komentarRoutes = require('./routes/komentar/')
const userAuth = require('./middleware/auth/authMiddleware');

const app = express();

app.use(bodyParser.json());


app.use(
  session({
    secret: '11223344', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, 
  })
);

app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

app.use('/users', userRoutes);
app.use('/foto', fotoRoutes);
app.use('/album', albumRoutes);
// app.use('/komentar', komentarRoutes)

app.use(userAuth); 

module.exports = app;
