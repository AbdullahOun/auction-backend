const express = require('express')
const { Get, Delete } = require('../controllers/bids.controller')
const verifyToken = require('../middlewares/verifyToken')
const router = express.Router()

/**
 * Route for getting top bidder.
 */
router
    .route('/auctions/:auctionId/top')
    /**
     * GET request to get top bidder.
     * Requires authentication.
     */
    .get(verifyToken, Get.top)

/**
 * Route for getting all bids for a specific auction.
 */
router
    .route('/auctions/:auctionId')
    /**
     * GET request to fetch all bids for a specific auction.
     * Requires no authentication.
     */
    .get(Get.all)

/**
 * Route for getting, updating, or deleting a specific bid.
 */
router
    .route('/:bidId')
    /**
     * GET request to fetch a specific bid.
     * Requires no authentication.
     */
    .get(Get.one)
    /**
     * DELETE request to delete a specific bid.
     * Requires authentication.
     */
    .delete(verifyToken, Delete.delete)

module.exports = router
