const express = require('express');
const bidController = require('../controllers/bids.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.route('/')
    .post(verifyToken,bidController.createBid);

router.route('/:auction_Id')
    .get(bidController.getAllBids);

router.route('/:bidId')
    .get(bidController.getBid)
    .delete(verifyToken,bidController.deleteBid);


module.exports = router;