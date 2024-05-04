const express = require('express')
const productController = require('../controllers/products.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

router
    .route('/:productId')
    .get(verifyToken, productController.getProduct)
    .patch(verifyToken, productController.updateProduct)

module.exports = router
