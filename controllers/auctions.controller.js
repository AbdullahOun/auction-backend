const Auction = require('../models/auction.model')
const Product = require('../models/product.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const paginate = require('../utils/paginate')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')
const mongoose = require('mongoose')
const deleteImages = require('../utils/deleteImages')
const productSchema = require('../utils/validation/productSchema')
const auctionSchema = require('../utils/validation/auctionSchema')

class Get {
    /**
     * Get all auctions with pagination.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    static all = asyncWrapper(async (req, res) => {
        const { limit, skip } = paginate(req)

        const auctions = await Auction.find({})
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('product')
            .populate({
                path: 'seller',
                select: '-password',
            })

        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auctions }))
    })
    /**
     * Get all auctions created by a specific user with pagination.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    static allByUserId = asyncWrapper(async (req, res) => {
        const { limit, skip } = paginate(req)
        const decodedId = req.decodedToken.id

        const auctions = await Auction.find({ seller: decodedId })
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('product')
            .populate({
                path: 'seller',
                select: '-password',
            })

        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auctions }))
    })
    /**
     * @description Get details of a specific auction.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static one = asyncWrapper(async (req, res, next) => {
        const auctionId = req.params.auctionId

        const auction = await Auction.findById(auctionId)
            .select('-__v')
            .populate('product')
            .populate({
                path: 'seller',
                select: '-password',
            })

        if (!auction) {
            return next(
                new AppError(
                    MODEL_MESSAGES.auction.notFound,
                    HTTP_STATUS_CODES.NOT_FOUND
                )
            )
        }

        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auction }))
    })
}

class Create {
    /**
     * @description Read product's data from the request body.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course create auction
     * @order 1
     */
    static readProductBody = asyncWrapper(async (req, res, next) => {
        try {
            const product = {
                name: req.body.name,
                initialPrice: req.body.initialPrice,
                maxPrice: req.body.maxPrice,
                quantity: req.body.quantity,
                description: req.body.description,
            }

            const images = req.files.map((file) => file.filename)
            product.images = images

            req.product = product
            req.images = images
            next()
        } catch (err) {
            if (req.images && req.images.length > 0) {
                await deleteImages(req.images)
            }
            next(err)
        }
    })
    /**
     * @description Validate product body.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course create auction
     * @order 2
     */
    static isValidProduct = asyncWrapper(async (req, res, next) => {
        try {
            req.product = await productSchema.validateAsync(req.product)
            next()
        } catch (err) {
            if (req.images && req.images.length > 0) {
                await deleteImages(req.images)
            }
            next(
                new AppError(
                    err.details[0].message,
                    HTTP_STATUS_CODES.BAD_REQUEST
                )
            )
        }
    })
    /**
     * @description Create product document in database.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course create auction
     * @order 3
     */
    static createProduct = asyncWrapper(async (req, res, next) => {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const newProducts = await Product.create([req.product], { session })
            req.product = newProducts[0]
            req.session = session
            next()
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            if (req.images && req.images.length > 0) {
                await deleteImages(req.images)
            }
            next(
                new AppError(
                    err.message,
                    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                )
            )
        }
    })
    /**
     * @description Read auction's data from the request body.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course create auction
     * @order 4
     */
    static readAuctionBody = asyncWrapper(async (req, res, next) => {
        try {
            const decodedId = req.decodedToken.id
            const auction = {
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                product: req.product._id.toString(),
                seller: decodedId,
            }

            req.auction = auction
            next()
        } catch (err) {
            if (req.images && req.images.length > 0) {
                await deleteImages(req.images)
            }
            next(err)
        }
    })
    /**
     * @description Validate auction body.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course create auction
     * @order 5
     */
    static isValidAuction = asyncWrapper(async (req, res, next) => {
        try {
            req.auction = await auctionSchema.validateAsync(req.auction)
            next()
        } catch (err) {
            if (req.images && req.images.length > 0) {
                await deleteImages(req.images)
            }
            next(
                new AppError(
                    err.details[0].message,
                    HTTP_STATUS_CODES.BAD_REQUEST
                )
            )
        }
    })
    /**
     * @description Create auction document in databse.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course create auction
     * @order 6
     */
    static createAuction = asyncWrapper(async (req, res, next) => {
        try {
            const newAuction = await Auction.create([req.auction], {
                session: req.session,
            })
            await req.session.commitTransaction()
            req.session.endSession()

            res.status(HTTP_STATUS_CODES.CREATED).json(
                new AppResponse({ auction: newAuction })
            )
        } catch (err) {
            await req.session.abortTransaction()
            req.session.endSession()
            if (req.images && req.images.length > 0) {
                await deleteImages(req.images)
            }
            next(
                new AppError(
                    err.message,
                    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                )
            )
        }
    })
}

class Update {
    /**
     * @description Validate auction body upon update.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update auction
     * @order 1
     */
    static isValidAuction = asyncWrapper(async (req, res, next) => {
        try {
            req.auction = await auctionSchema.validateAsync(req.auction)
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
     * @description Check if the auction exists.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update auction
     * @order 2
     */
    static isExists = asyncWrapper(async (req, res, next) => {
        const auctionId = req.params.auctionId

        const auction = await Auction.findById(auctionId).select([
            '_id',
            'seller',
        ])

        if (!auction) {
            return next(
                new AppError(
                    MODEL_MESSAGES.auction.notFound,
                    HTTP_STATUS_CODES.NOT_FOUND
                )
            )
        }
        req.oldAuction = auction
        next()
    })
    /**
     * @description Check if the user has permission to update the auction.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update auction
     * @order 3
     */
    static isUserAuthorized = asyncWrapper(async (req, res, next) => {
        const decodedId = req.decodedToken.id

        const auction = req.oldAuction

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
     * @description Update the auction with the new data.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update auction
     * @order 4
     */
    static update = asyncWrapper(async (req, res, next) => {
        const auctionId = req.params.auctionId

        await Auction.updateOne(
            { _id: auctionId },
            { $set: { ...req.auction } }
        )

        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
    })
}

class Delete {
    /**
     * @description Validate auction ownership.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course delete auction
     * @order 1
     */
    static isUserAuthorized = asyncWrapper(async (req, res, next) => {
        try {
            const session = await mongoose.startSession()
            session.startTransaction()

            const auctionId = req.params.auctionId
            const decodedId = req.decodedToken.id

            const auction = await Auction.findById(auctionId)
                .select(['_id', 'seller', 'product'])
                .session(session)

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

            req.auction = auction
            req.session = session
            next()
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            next(
                new AppError(
                    err.message,
                    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                )
            )
        }
    })
    /**
     * @description Find the related product and store its images array.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course delete auction
     * @order 2
     */
    static getProductImages = asyncWrapper(async (req, res, next) => {
        try {
            const product = await Product.findById(req.auction.product)
                .select(['_id', 'images'])
                .session(req.session)

            req.images = product.images
            next()
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            next(
                new AppError(
                    err.message,
                    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                )
            )
        }
    })

    /**
     * @description Delete the related product.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course delete auction
     * @order 3
     */
    static deleteProduct = asyncWrapper(async (req, res, next) => {
        try {
            await Product.deleteOne({ _id: req.auction.product }).session(
                req.session
            )
            next()
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            next(
                new AppError(
                    err.message,
                    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                )
            )
        }
    })

    /**
     * @description Delete the auction.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course delete auction
     * @order 4
     */
    static deleteAuction = asyncWrapper(async (req, res, next) => {
        try {
            await Auction.deleteOne({ _id: req.auction._id }).session(
                req.session
            )
            next()
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            next(
                new AppError(
                    err.message,
                    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                )
            )
        }
    })

    /**
     * @description Delete the related product images.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course delete auction
     * @order 5
     */
    static deleteProductImages = asyncWrapper(async (req, res, next) => {
        try {
            await deleteImages(req.images)
            await req.session.commitTransaction()
            req.session.endSession()
            res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            next(
                new AppError(
                    err.message,
                    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                )
            )
        }
    })
}

module.exports = {
    Get,
    Create,
    Update,
    Delete,
}
