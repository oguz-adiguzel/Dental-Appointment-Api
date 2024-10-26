const express = require('express')
const authController = require('../controller/authController')
const router = express.Router()

// Admin ekle
router.post('/signup', authController.createUser)

// Admine giriş yap
router.post('/login', authController.loginUser)

module.exports = router