const Auction = require('../models/auction.model')
const Product = require('../models/product.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const paginate = require('../utils/paginate')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')
const mongoose = require('mongoose')
const deleteImages = require('../utils/deleteImages')

/**
 * Get all auctions with pagination.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllAuctions = asyncWrapper(async (req, res) => {
    const { limit, skip } = paginate(req)

    const auctions = await Auction.find({})
        .select('-__v')
        .limit(limit)
        .skip(skip)
        .populate('product')
        .populate('seller')

    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auctions }))
})

/**
 * Get all auctions created by a specific user with pagination.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllAuctionsForUser = asyncWrapper(async (req, res) => {
    const { limit, skip } = paginate(req)
    const decodedId = req.decodedToken.id

    const auctions = await Auction.find({ seller: decodedId })
        .select('-__v')
        .limit(limit)
        .skip(skip)
        .populate('product')
        .populate('seller')

    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auctions }))
})

/**
 * Get details of a specific auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAuction = asyncWrapper(async (req, res, next) => {
    const auctionId = req.params.auctionId

    const auction = await Auction.findById(auctionId)
        .select('-__v')
        .populate('product')
        .populate('seller')

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

/**
 * Create a new auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createAuction = asyncWrapper(async (req, res, next) => {
    let imagesPaths
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const decodedId = req.decodedToken.id

        // Create a new product from request body.
        const product = {
            name: req.body.name,
            initialPrice: req.body.initialPrice,
            maxPrice: req.body.maxPrice,
            quantity: req.body.quantity,
            description: req.body.description,
        }

        // Save uploaded images to product.
        const images = []
        const imagesFiles = req.files
        for (let i = 0; i < imagesFiles.length; i++) {
            images.push(imagesFiles[i].filename)
        }
        product.images = images
        imagesPaths = images

        // Create the product in the same transaction
        const newProduct = await Product.create([product], { session })

        // Create the auction and link it to the newly created product
        const newAuction = await Auction.create(
            [
                {
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    product: newProduct[0]._id,
                    price: req.body.maxPrice,
                    seller: decodedId,
                },
            ],
            { session }
        )

        await session.commitTransaction()
        session.endSession()

        res.status(HTTP_STATUS_CODES.CREATED).json(
            new AppResponse({ product: newProduct[0], auction: newAuction })
        )
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        if (imagesPaths && imagesPaths.length > 0) {
            await deleteImages(imagesPaths)
        }
        return next(
            new AppError(
                'Failed to create auction and product',
                HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            )
        )
    }
})

/**
 * Update details of a specific auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateAuction = asyncWrapper(async (req, res, next) => {
    const auctionId = req.params.auctionId
    const decodedId = req.decodedToken.id

    const auction = await Auction.findById(auctionId).select(['_id', 'seller'])

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

    await Auction.updateOne({ _id: auctionId }, { $set: { ...req.body } })
    return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
})

/**
 * Delete a specific auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const deleteAuction = asyncWrapper(async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
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

        const product = await Product.findById(auction.product)
            .select(['_id', 'images'])
            .session(session)

        const imagesPaths = product.images

        // Delete product and auction
        await Product.deleteOne({ _id: product._id }).session(session)
        await Auction.deleteOne({ _id: auctionId }).session(session)

        // Delete product images synchronously
        await deleteImages(imagesPaths)
        // Commit the transaction
        await session.commitTransaction()
        session.endSession()

        return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction()
        session.endSession()

        // Handle errors
        return next(
            new AppError(
                'Failed to delete auction and product',
                HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            )
        )
    }
})

module.exports = {
    getAllAuctions,
    getAllAuctionsForUser,
    getAuction,
    createAuction,
    updateAuction,
    deleteAuction,
}
