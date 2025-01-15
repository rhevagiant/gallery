const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/userController');

router.get('/', userController.getAllUsers);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logout);

module.exports = router;
