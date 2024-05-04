const Bid = require('../models/bid.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

/**
 * Retrieves all bids for a specific auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllBids = asyncWrapper(
    async (req, res, next) => {
        const bids = await Bid.find({ auctionId: req.params.auction_Id }, { "__v": false });
        res.json({ status: httpStatusText.SUCCESS, data: { bids }, error: null });
    }
);

/**
 * Retrieves a bid by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getBid = asyncWrapper(
    async (req, res, next) => {
        const bid = await Bid.findById(req.params.bidId);
        if (!bid) {
            const error = appError.create('Bid not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { bid }, error: null });
    }
);

/**
 * Creates a new bid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const createBid = asyncWrapper(
    async (req, res) => {
        const newBid = new Bid({
            auctionId: req.body.auctionId,
            price: req.body.price,
            buyerId: req.decodedToken.id
        });
        await newBid.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newBid }, error: null });
    }
);

/**
 * Deletes a bid by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteBid = asyncWrapper(
    async (req, res, next) => {
        const bidId = req.params.bidId;
        await Bid.deleteOne({ _id: bidId });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getAllBids,
    getBid,
    createBid,
    deleteBid
};
