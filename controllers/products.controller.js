const Product = require('../models/product.model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const appError = require('../utils/appError')
const Auction = require('../models/auction.model')

/**
 * Retrieves a product by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getProduct = asyncWrapper(async (req, res, next) => {
    const product = await Product.findById(req.params.productId)
    if (!product) {
        const error = appError.create(
            'Product not found',
            404,
            httpStatusText.FAIL
        )
        return next(error)
    }
    res.json({ status: httpStatusText.SUCCESS, data: { product }, error: null })
})

/**
 * Updates a product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateProduct = asyncWrapper(async (req, res, next) => {
    const productId = req.params.productId
    const auction = await Auction.findOne({ productId: productId })
    if (!auction) {
        const error = appError.create(
            "Product's Auction not found",
            404,
            httpStatusText.FAIL
        )
        return next(error)
    }

    if (auction.sellerId != req.decodedToken.id) {
        const error = appError.create(
            'User not authorized',
            401,
            httpStatusText.FAIL
        )
        return next(error)
    }
    await Product.updateOne({ _id: productId }, { $set: { ...req.body } })
    return res
        .status(200)
        .json({ status: httpStatusText.SUCCESS, data: null, error: null })
})

module.exports = {
    getProduct,
    updateProduct,
}
