const express = require('express')
const { Get, Update } = require('../controllers/products.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

/**
 * Routes for managing individual products.
 */
router
    .route('/:productId')
    /**
     * GET request to retrieve a specific product.
     * Requires authentication.
     */
    .get(
        verifyToken,
        Get.One.isAuctionExists,
        Get.One.isUserAuthorized,
        Get.One.one
    )
    /**
     * PATCH request to update a specific product.
     * Requires authentication.
     */
    .patch(
        verifyToken,
        Update.isValid,
        Update.isAuctionExists,
        Update.isUserAuthorized,
        Update.update
    )

module.exports = router
