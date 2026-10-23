const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')


// Register User
router.post("/register", userController.register);

// Login User
router.post('/login', userController.login);



module.exports = router;

