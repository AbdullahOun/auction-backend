const express = require('express')
const bidController = require('../controllers/bids.controller')
const verifyToken = require('../middlewares/verifyToken')
const router = express.Router()

/**
 * Route for creating a new bid.
 */
router
    .route('/')
    /**
     * POST request to create a new bid.
     * Requires authentication.
     */
    .post(verifyToken, bidController.createBid)

/**
 * Route for getting all bids for a specific auction.
 */
router
    .route('/auctions/:auctionId')
    /**
     * GET request to fetch all bids for a specific auction.
     * Requires no authentication.
     */
    .get(bidController.getAllBids)

/**
 * Route for getting, updating, or deleting a specific bid.
 */
router
    .route('/:bidId')
    /**
     * GET request to fetch a specific bid.
     * Requires no authentication.
     */
    .get(bidController.getBid)
    /**
     * DELETE request to delete a specific bid.
     * Requires authentication.
     */
    .delete(verifyToken, bidController.deleteBid)

module.exports = router
