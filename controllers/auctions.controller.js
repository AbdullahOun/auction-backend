const Auction = require('../models/auction.model')
const Product = require('../models/product.model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const appError = require('../utils/appError')
const { ObjectId } = require('mongodb')
/**
 * Retrieves all auctions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllAuctions = asyncWrapper(async (req, res) => {
    const limit = req.query.limit || 6
    const page = req.query.page || 1
    const skip = (page - 1) * limit
    const auctions = await Auction.find({}, { __v: false })
        .limit(limit)
        .skip(skip)
        .populate('productId')
        .populate('sellerId')

    res.json({ status: 'success', data: { auctions }, error: null })
})

/**
 * Retrieves all auctions for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllAuctionsForUser = asyncWrapper(async (req, res) => {
    const limit = req.query.limit || 6
    const page = req.query.page || 1
    const skip = (page - 1) * limit
    const auctions = await Auction.find(
        { sellerId: req.decodedToken.id },
        { __v: false }
    )
        .limit(limit)
        .skip(skip)
        .populate('productId')
    res.json({
        status: httpStatusText.SUCCESS,
        data: { auctions },
        error: null,
    })
})

/**
 * Retrieves an auction by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAuction = asyncWrapper(async (req, res, next) => {
    const action = await Auction.findOne({ _id: req.params.auctionId })
        .populate('productId')
        .populate('sellerId')
    if (!action) {
        const error = appError.create(
            'Action not found',
            404,
            httpStatusText.FAIL
        )
        return next(error)
    }
    res.json({ status: httpStatusText.SUCCESS, data: { action }, error: null })
})

/**
 * Creates a new auction and associated product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createAuction = asyncWrapper(async (req, res) => {
    const product = {
        name: req.body.name,
        initialPrice: req.body.initialPrice,
        maxPrice: req.body.maxPrice,
        quantity: req.body.quantity,
        description: req.body.description,
    }

    const images = []
    const imagesFiles = req.files
    for (let i = 0; i < imagesFiles.length; i++) {
        images.push(imagesFiles[i].filename)
    }

    product.images = images
    let newProduct = new Product(product)
    await newProduct.save()

    const auction = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        productId: newProduct._id,
        price: req.body.maxPrice,
        sellerId: req.decodedToken.id,
    }

    const newAction = new Auction(auction)
    await newAction.save()

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { newAction },
        error: null,
    })
})

/**
 * Updates an auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateAuction = asyncWrapper(async (req, res, next) => {
    const auctionId = req.params.auctionId
    const auction = await Auction.findById(auctionId)

    if (!auction) {
        const error = appError.create(
            'Action not found',
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

    await Auction.updateOne({ _id: auctionId }, { $set: { ...req.body } })
    return res
        .status(200)
        .json({ status: httpStatusText.SUCCESS, data: null, error: null })
})

/**
 * Deletes an auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteAuction = asyncWrapper(async (req, res, next) => {
    const auctionId = req.params.auctionId
    const auction = await Auction.findById(auctionId)
    if (!auction) {
        const error = appError.create(
            'Action not found',
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
    await Product.deleteOne(auction.productId)
    await Auction.deleteOne({ _id: auctionId })
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null,
        error: null,
    })
})

module.exports = {
    getAllAuctions,
    getAllAuctionsForUser,
    getAuction,
    createAuction,
    updateAuction,
    deleteAuction,
}
