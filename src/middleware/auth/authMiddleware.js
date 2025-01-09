const express = require('express');
const session = require('express-session');

const userAuth = (req, res, next) => {
    if (req.session && req.session.UserID) {
      next();
    } else {
      res.status(401).json({ error: 'Anda harus login untuk mengakses halaman ini' });
    }
  };
  
  module.exports = userAuth;
  