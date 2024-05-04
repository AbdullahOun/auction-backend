const express = require('express')
const auctionController = require('../controllers/auctions.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const { upload } = require('../middlewares/uplaod')

router
    .route('/')
    .get(auctionController.getAllAuctions)
    .post(
        verifyToken,
        upload.array('images', 3),
        auctionController.createAuction
    )
router.route('/users').get(verifyToken, auctionController.getAllAuctionsForUser)
router
    .route('/:auctionId')
    .get(verifyToken, auctionController.getAuction)
    .patch(verifyToken, auctionController.updateAuction)
    .delete(verifyToken, auctionController.deleteAuction)

router.route('/:product_Id').get(auctionController.getAuction)

module.exports = router
