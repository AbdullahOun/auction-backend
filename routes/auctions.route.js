const express = require('express')
const {
    Get,
    Create,
    Update,
    Delete,
} = require('../controllers/auctions.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const upload = require('../middlewares/uplaod')

/**
 * Route for getting all auctions or creating a new auction.
 */
router
    .route('/')
    /**
     * GET request to fetch all auctions.
     * Requires authentication.
     */
    .get(Get.all)
    /**
     * POST request to create a new auction.
     * Requires authentication and file upload.
     */
    .post(
        verifyToken,
        upload.array('images', 3),
        Create.readProductBody,
        Create.isValidProduct,
        Create.createProduct,
        Create.readAuctionBody,
        Create.isValidAuction,
        Create.createAuction
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
    .get(verifyToken, Get.allByUserId)

/**
 * Route for getting, updating, or deleting a specific auction.
 */
router
    .route('/:auctionId')
    /**
     * GET request to fetch a specific auction.
     * Requires authentication.
     */
    .get(Get.one)
    /**
     * PATCH request to update a specific auction.
     * Requires authentication.
     */
    .patch(
        verifyToken,
        Update.isValidAuction,
        Update.isExists,
        Update.isUserAuthorized,
        Update.update
    )
    /**
     * DELETE request to delete a specific auction.
     * Requires authentication.
     */
    .delete(
        verifyToken,
        Delete.isUserAuthorized,
        Delete.getProductImages,
        Delete.deleteProduct,
        Delete.deleteAuction,
        Delete.deleteProductImages
    )

module.exports = router
