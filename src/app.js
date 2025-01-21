const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/userRoutes');
const fotoRoutes = require('./routes/foto/fotoRoutes');
const albumRoutes = require('./routes/album/albumRoutes');
// const komentarRoutes = require('./routes/komentar/')
const userAuth = require('./middleware/auth/authMiddleware');



const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Harus sesuai dengan asal frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
}));



// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });
// app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
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

app.use('/auth', userRoutes);
app.use('/foto', fotoRoutes);
app.use('/album', albumRoutes);
// app.use('/komentar', komentarRoutes)

app.use(userAuth);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack); // Log error ke console
  res.status(500).json({ message: 'Internal Server Error' });
});


module.exports = app;
