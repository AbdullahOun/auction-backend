const Bid = require('../models/bid.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppResponse = require('../utils/appResponse')
const AppError = require('../utils/appError')
const paginate = require('../utils/paginate')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')

/**
 * Get all bids for a specific auction with pagination.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAllBids = asyncWrapper(async (req, res, next) => {
    const { limit, skip } = paginate(req)
    const auctionId = req.params.auctionId

    const bids = await Bid.find({ auction: auctionId })
        .select('-__v')
        .limit(limit)
        .skip(skip)
        .populate('auction')
        .populate('buyer')

    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ bids }))
})

/**
 * Get details of a specific bid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getBid = asyncWrapper(async (req, res, next) => {
    const bidId = req.params.bidId

    const bid = await Bid.findById(bidId)
        .select('-__v')
        .populate('auction')
        .populate('buyer')

    if (!bid) {
        return next(
            new AppError(
                MODEL_MESSAGES.bid.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }
    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ bid }))
})

/**
 * Create a new bid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createBid = asyncWrapper(async (req, res) => {
    const decodedId = req.decodedToken.id

    const newBid = new Bid({
        auction: req.body.auctionId,
        price: req.body.price,
        buyer: decodedId,
    })

    await newBid.save()
    return res
        .status(HTTP_STATUS_CODES.CREATED)
        .json(new AppResponse({ bid: newBid }))
})

/**
 * Delete a specific bid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const deleteBid = asyncWrapper(async (req, res, next) => {
    const bidId = req.params.bidId
    const bid = await Bid.findById(bidId).select(['_id', 'buyer'])
    if (!bid) {
        return next(
            new AppError(
                MODEL_MESSAGES.bid.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    if (bid.buyer != req.decodedToken.id) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.unauthorized,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        )
    }

    await Bid.deleteOne({ _id: bidId })
    return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
})

module.exports = {
    getAllBids,
    getBid,
    createBid,
    deleteBid,
}
