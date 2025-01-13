// middlewares/authMiddleware.js
const userAuth = (req, res, next) => {
  console.log('Session di middleware:', req.session); 
  if (req.session && req.session.UserID) {
    req.user = { UserID: req.session.UserID };
    next();
  } else {
    res.status(401).json({ error: 'Anda harus login untuk mengakses halaman ini' });
  }
};

module.exports = userAuth;
