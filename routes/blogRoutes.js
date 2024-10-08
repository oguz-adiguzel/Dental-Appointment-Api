const express = require('express')
const blogController = require('../controller/blogController')
const router = express.Router()

//Blog oluştur
router.post('/', blogController.createBlog)

//Tüm blogları al
router.get('/', blogController.getAllBlog)

//Tek Blog Getir
router.get('/:slug', blogController.getABlog)

module.exports = router