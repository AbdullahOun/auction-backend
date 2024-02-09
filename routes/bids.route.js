const express = require('express');
const bidController = require('../controllers/bids.controller');
const router = express.Router();

router.route('/')
    .post(bidController.createBid);

router.route('/:auction_Id')
    .get(bidController.getAllBids);

router.route('/:bidId')
    .get(bidController.getBid)
    .delete(bidController.deleteBid);


module.exports = router;