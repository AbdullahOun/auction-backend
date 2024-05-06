const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const { upload } = require('../middlewares/uplaod')
const imagesController = require('../controllers/images.controller')

router
    .route('/upload')
    /**
     * POST request to upload an image.
     * Requires authentication.
     */
    .post(verifyToken, upload.single('image'), imagesController.uploadImage)

router
    .route('/remove/:imagePath')
    /**
     * DLETE request to upload an image.
     * Requires authentication.
     */
    .delete(verifyToken, imagesController.removeImage)

module.exports = router
