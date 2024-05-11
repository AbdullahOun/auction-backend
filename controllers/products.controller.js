const Product = require('../models/product.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const Auction = require('../models/auction.model')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')
const productSchema = require('../utils/validation/productSchema')
class Get {
    static One = class {
        /**
         * @description Check if the auction exists for the given product ID.
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @course get product
         * @order 1
         */
        static isAuctionExists = asyncWrapper(async (req, res, next) => {
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

            req.auction = auction
            next()
        })

        /**
         * @description Check if the user is authorized to access the product.
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @course get product
         * @order 2
         */
        static isUserAuthorized = asyncWrapper(async (req, res, next) => {
            const decodedId = req.decodedToken.id
            const auction = req.auction

            if (auction.seller != decodedId) {
                return next(
                    new AppError(
                        MODEL_MESSAGES.user.unauthorized,
                        HTTP_STATUS_CODES.FORBIDDEN
                    )
                )
            }

            next()
        })

        /**
         * @description Get the specific product from the database.
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @course get product
         * @order 3
         */
        static one = asyncWrapper(async (req, res, next) => {
            const productId = req.params.productId
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
    }
}

class Update {
    /**
     * @description Validate product details upon update.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update product
     * @order 1
     */
    static isValid = asyncWrapper(async (req, res, next) => {
        try {
            req.product = await productSchema.validateAsync(req.body)
            next()
        } catch (err) {
            next(
                new AppError(
                    err.details[0].message,
                    HTTP_STATUS_CODES.BAD_REQUEST
                )
            )
        }
    })

    /**
     * @description Check if the auction exists for the given product ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update product
     * @order 2
     */
    static isAuctionExists = asyncWrapper(async (req, res, next) => {
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

        req.auction = auction
        next()
    })

    /**
     * @description Check if the user is authorized to update the product.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update product
     * @order 3
     */
    static isUserAuthorized = asyncWrapper(async (req, res, next) => {
        const decodedId = req.decodedToken.id
        const auction = req.auction

        if (auction.seller != decodedId) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.unauthorized,
                    HTTP_STATUS_CODES.FORBIDDEN
                )
            )
        }

        next()
    })

    /**
     * @description Update the details of the product in the database.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update product
     * @order 4
     */
    static update = asyncWrapper(async (req, res, next) => {
        const productId = req.params.productId

        await Product.updateOne(
            { _id: productId },
            { $set: { ...req.product } }
        )

        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
    })
}

module.exports = {
    Get,
    Update,
}
