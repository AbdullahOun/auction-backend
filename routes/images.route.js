const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const upload = require('../middlewares/uplaod')
const { Create, Delete } = require('../controllers/images.controller')

router
    .route('/upload')
    /**
     * POST request to upload an image.
     * Requires authentication.
     */
    .post(verifyToken, upload.single('image'), Create.upload)

router
    .route('/remove/:imagePath')
    /**
     * DLETE request to upload an image.
     * Requires authentication.
     */
    .delete(verifyToken, Delete.remove)

module.exports = router
