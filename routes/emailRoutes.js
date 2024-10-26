const express = require('express');
const router = express.Router();
const emailController = require('../controller/emailController');

// Email doğrulama kodu gönderme route'u
router.post('/send-code', emailController.sendVerificationCode);

// Kod doğrulama route'u
router.post('/verify-code', emailController.verifyCode);

module.exports = router;