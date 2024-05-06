const Product = require('../models/product.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const Auction = require('../models/auction.model')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')

/**
 * Get a specific product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getProduct = asyncWrapper(async (req, res, next) => {
    const productId = req.params.productId

    const auction = await Auction.findOne({ product: productId })

    if (!auction) {
        return next(
            new AppError(
                MODEL_MESSAGES.auction.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    if (auction.seller != req.decodedToken.id) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.unauthorized,
                HTTP_STATUS_CODES.FORBIDDEN
            )
        )
    }

    const product = await Product.findById(productId).select('-__v')

    if (!product) {
        return next(
            new AppError(
                MODEL_MESSAGES.product.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ product }))
})

/**
 * Update details of a specific product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateProduct = asyncWrapper(async (req, res, next) => {
    const productId = req.params.productId
    const decodedId = req.decodedToken.id
    const auction = await Auction.findOne({ product: productId })

    if (!auction) {
        return next(
            new AppError(
                MODEL_MESSAGES.auction.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    if (auction.seller != decodedId) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.unauthorized,
                HTTP_STATUS_CODES.FORBIDDEN
            )
        )
    }

    await Product.updateOne({ _id: productId }, { $set: { ...req.body } })

    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
})

module.exports = {
    getProduct,
    updateProduct,
}
