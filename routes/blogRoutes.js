const express = require('express')
const blogController = require('../controller/blogController')
const verifyToken = require('../middlewares/verifyToken')
const router = express.Router()

//Blog oluştur
router.post('/', blogController.createBlog)

//Tüm blogları al
router.get('/', blogController.getAllBlog)

//Tek Blog Getir
router.get('/:slug', blogController.getABlog)

//Tek Blog Getir
router.delete('/:id', blogController.deleteBlog)


module.exports = router