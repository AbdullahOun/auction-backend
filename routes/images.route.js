const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const { upload } = require('../middlewares/uplaod')
const imagesController = require('../controllers/images.controller')

router
    .route('/upload')
    .post(verifyToken, upload.single('image'), imagesController.uploadImage)

module.exports = router
