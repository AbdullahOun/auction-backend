const express = require('express')
const auctionController = require('../controllers/auctions.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const { upload } = require('../middlewares/uplaod')

/**
 * Route for getting all auctions or creating a new auction.
 */
router
    .route('/')
    /**
     * GET request to fetch all auctions.
     * Requires authentication.
     */
    .get(auctionController.getAllAuctions)
    /**
     * POST request to create a new auction.
     * Requires authentication and file upload.
     */
    .post(
        verifyToken,
        upload.array('images', 3),
        auctionController.createAuction
    )

/**
 * Route for getting all auctions for a specific user.
 */
router
    .route('/users')
    /**
     * GET request to fetch all auctions for a specific user.
     * Requires authentication.
     */
    .get(verifyToken, auctionController.getAllAuctionsForUser)

/**
 * Route for getting, updating, or deleting a specific auction.
 */
router
    .route('/:auctionId')
    /**
     * GET request to fetch a specific auction.
     * Requires authentication.
     */
    .get(verifyToken, auctionController.getAuction)
    /**
     * PATCH request to update a specific auction.
     * Requires authentication.
     */
    .patch(verifyToken, auctionController.updateAuction)
    /**
     * DELETE request to delete a specific auction.
     * Requires authentication.
     */
    .delete(verifyToken, auctionController.deleteAuction)

module.exports = router
