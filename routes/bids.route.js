const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const router = express.Router()
const BidsRepo = require('../repos/bids.repo')
const BidsController = require('../controllers/bids.controller')

const bidsRepo = new BidsRepo()
const bidsController = new BidsController(bidsRepo)

router.route('/auctions/:auctionId/top').get(bidsController.getTop)
router.route('/auctions/:auctionId').get(bidsController.getAll)
router.route('/:bidId').get(bidsController.getById).delete(verifyToken, bidsController.delete)

module.exports = router
