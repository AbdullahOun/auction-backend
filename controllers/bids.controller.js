const Bid = require('../models/bid.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppResponse = require('../utils/appResponse')
const AppError = require('../utils/appError')
const paginate = require('../utils/paginate')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')

class Get {
    /**
     * @description Get all bids for a specific auction with pagination.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static all = asyncWrapper(async (req, res, next) => {
        const { limit, skip } = paginate(req)
        const auctionId = req.params.auctionId

        const bids = await Bid.find({ auction: auctionId })
            .select('-__v')
            .sort({ price: -1 })
            .limit(limit)
            .skip(skip)
            .populate('auction')
            .populate({
                path: 'buyer',
                select: '-password',
            })

        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ bids }))
    })

    /**
     * @description Get details of a specific bid.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static one = asyncWrapper(async (req, res, next) => {
        const bidId = req.params.bidId

        const bid = await Bid.findById(bidId)
            .select('-__v')
            .populate('auction')
            .populate({
                path: 'buyer',
                select: '-password',
            })

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
    static top = asyncWrapper(async (req, res, next) => {
        const auctionId = req.params.auctionId
        const bid = await Bid.findOne({ auction: auctionId })
            .sort({ price: -1 })
            .select('-__v')
            .populate('auction')
            .populate({
                path: 'buyer',
                select: '-password',
            })

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
}

class Delete {
    /**
     * @description Delete a specific bid.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static delete = asyncWrapper(async (req, res, next) => {
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
}

module.exports = {
    Get,
    Delete,
}
