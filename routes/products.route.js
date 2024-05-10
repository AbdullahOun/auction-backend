const express = require('express')
const productController = require('../controllers/products.controller')
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
    .get(verifyToken, productController.getProduct)
    /**
     * PATCH request to update a specific product.
     * Requires authentication.
     */
    .patch(verifyToken, productController.updateProduct)

module.exports = router
