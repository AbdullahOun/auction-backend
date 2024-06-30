const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const AuctionController = require('../controllers/auctions.controller')
const AuctionRepo = require('../repos/auction.repo')
const upload = require('../middlewares/uplaod')
const S3Util = require('../utils/storage/S3Util')

const router = express.Router()
const repo = new AuctionRepo()
const s3Util = new S3Util()
const controller = new AuctionController(repo, s3Util)

router.route('/').get(controller.getAll).post(verifyToken, upload.array('images'), controller.create)
router.route('/users').get(verifyToken, controller.getAllByUserId)
router
    .route('/:auctionId')
    .get(controller.getById)
    .patch(verifyToken, controller.update)
    .delete(verifyToken, controller.delete)

module.exports = router
