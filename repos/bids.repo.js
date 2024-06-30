const Bid = require('../models/bid.model')

/**
 * Repository class for handling Bid operations.
 */
class BidsRepo {
    /**
     * Retrieves all bids for a specific auction.
     * @param {string} auctionId - ID of the auction to retrieve bids for.
     * @param {number} limit - Maximum number of bids to retrieve.
     * @param {number} skip - Number of bids to skip.
     * @returns {Promise<Array<Object>>} Array of bids for the auction.
     */
    async getAll(auctionId, limit, skip) {
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
        return bids
    }

    /**
     * Retrieves a bid by its ID.
     * @param {string} bidId - ID of the bid to retrieve.
     * @returns {Promise<Object|null>} Retrieved bid object or null if not found.
     */
    async getById(bidId) {
        const bid = await Bid.findById(bidId).select('-__v').populate('auction').populate({
            path: 'buyer',
            select: '-password',
        })

        return bid
    }

    /**
     * Retrieves the top bid (highest price) for a specific auction.
     * @param {string} auctionId - ID of the auction to retrieve the top bid for.
     * @returns {Promise<Object|null>} Top bid object or null if no bids exist for the auction.
     */
    async getTop(auctionId) {
        const bid = await Bid.findOne({ auction: auctionId })
            .sort({ price: -1 })
            .select('-__v')
            .populate('auction')
            .populate({
                path: 'buyer',
                select: '-password',
            })
        return bid
    }

    /**
     * Deletes a bid by its ID if the requesting user owns the bid.
     * @param {string} bidId - ID of the bid to delete.
     * @param {string} userId - ID of the user requesting the delete operation.
     * @returns {Promise<Object|null>} Deleted bid object or null if not found or unauthorized.
     */
    async delete(bidId, userId) {
        const bid = Bid.findOneAndDelete({ _id: bidId, buyer: userId })
        return bid
    }

    /**
     * Creates a new bid and retrieves the created bid object.
     * @param {string} auctionId - ID of the auction to place the bid on.
     * @param {string} buyerId - ID of the buyer placing the bid.
     * @param {number} price - Price of the bid.
     * @returns {Promise<Object>} Created bid object.
     */
    async createAndRetireve(auctionId, buyerId, price) {
        const bid = new Bid({
            auction: auctionId,
            buyer: buyerId,
            price: price,
        })
        await bid.save()

        const newBid = await Bid.findById(bid._id).populate('auction').populate({
            path: 'buyer',
            select: '-password',
        })

        return newBid
    }
}

module.exports = BidsRepo
