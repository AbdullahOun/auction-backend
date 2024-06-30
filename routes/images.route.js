const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const upload = require('../middlewares/uplaod')
const S3util = require('../utils/storage/S3Util')
const ImagesController = require('../controllers/images.controller')

const s3Util = new S3util()
const imagesController = new ImagesController(s3Util)

router.route('/upload').post(verifyToken, upload.single('image'), imagesController.upload)
router.route('/remove/:imagePath').delete(verifyToken, imagesController.delete)

module.exports = router
