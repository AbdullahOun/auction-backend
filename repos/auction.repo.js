const Auction = require('../models/auction.model')
const RedisCacheClient = require('../utils/storage/RedisCacheClient')

/**
 * Repository class for handling Auction operations.
 */
class AuctionRepo {
    /**
     * Retrieves all auctions based on optional filtering criteria.
     * Caches the first page of auctions if no filters are applied.
     * @param {number} limit - Maximum number of auctions to retrieve.
     * @param {number} skip - Number of auctions to skip.
     * @param {string} userId - Optional. Filters auctions by seller's user ID.
     * @param {number} minPrice - Optional. Minimum initial price of auctions.
     * @param {number} maxPrice - Optional. Maximum initial price of auctions.
     * @param {Array<string>} tags - Optional. Array of tags to filter auctions.
     * @param {Date} minStartDate - Optional. Minimum start date of auctions.
     * @param {Date} maxStartDate - Optional. Maximum start date of auctions.
     * @returns {Promise<Array<Object>>} Array of auctions matching the criteria.
     */
    async getAll(
        limit,
        skip,
        userId = null,
        minPrice = null,
        maxPrice = null,
        tags = null,
        minStartDate = null,
        maxStartDate = null
    ) {
        let query = {}

        if (userId) {
            query.seller = userId
        }
        if (maxPrice || minPrice) {
            let initialPrice = {}
            if (maxPrice) initialPrice.$lte = maxPrice
            if (minPrice) initialPrice.$gte = minPrice
            query.initialPrice = initialPrice
        }

        if (minStartDate || maxStartDate) {
            let startDate = {}
            if (maxStartDate) startDate.$lte = new Date(maxStartDate)
            if (minStartDate) startDate.$gte = new Date(minStartDate)
            query.startDate = startDate
        }

        if (tags && tags.length > 0) {
            query.tags = { $in: tags }
        }

        if (query == {}) {
            const auctions = await RedisCacheClient.get('auctionsFirstPage')
            if (auctions) {
                return auctions
            }
        }

        const auctions = await Auction.find(query)
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate({
                path: 'seller',
                select: '-password',
            })

        if (skip == 0) {
            await RedisCacheClient.set('auctionsFirstPage', auctions)
        }

        return auctions
    }

    /**
     * Retrieves an auction by its ID.
     * @param {string} auctionId - ID of the auction to retrieve.
     * @returns {Promise<Object|null>} Retrieved auction object or null if not found.
     */
    async getById(auctionId) {
        const auction = await Auction.findById(auctionId).select('-__v').populate({
            path: 'seller',
            select: '-password',
        })
        return auction
    }

    /**
     * Creates a new auction.
     * @param {Object} body - Auction data to create.
     * @returns {Promise<Object>} Created auction object.
     */
    async create(body) {
        const auction = new Auction(body)
        await auction.save()
        return auction
    }

    /**
     * Updates an existing auction.
     * @param {string} auctionId - ID of the auction to update.
     * @param {string} userId - ID of the user who owns the auction.
     * @param {Object} body - New data to update in the auction.
     * @returns {Promise<Object|null>} Updated auction object or null if not found or unauthorized.
     */
    async update(auctionId, userId, body) {
        const auction = await Auction.findOneAndUpdate({ _id: auctionId, seller: userId }, body, { new: true })
        return auction
    }

    /**
     * Deletes an auction.
     * @param {string} auctionId - ID of the auction to delete.
     * @param {string} userId - ID of the user who owns the auction.
     * @returns {Promise<Object|null>} Deleted auction object or null if not found or unauthorized.
     */
    async delete(auctionId, userId) {
        const auction = await Auction.findOneAndDelete({
            _id: auctionId,
            seller: userId,
        })
        return auction
    }

    /**
     * Searches auctions by name using text search.
     * @param {string} part - Partial name to search for.
     * @param {number} limit - Maximum number of auctions to retrieve.
     * @param {number} skip - Number of auctions to skip.
     * @returns {Promise<Array<Object>>} Array of auctions matching the name search criteria.
     */
    async searchByName(part, limit, skip) {
        try {
            const auctions = await Auction.aggregate([
                {
                    $match: {
                        $text: { $search: part.toLowerCase() },
                    },
                },
                { $addFields: { score: { $meta: 'textScore' } } },
                { $sort: { score: { $meta: 'textScore' } } },
                { $limit: limit },
                { $skip: skip },
            ]).exec()

            return auctions
        } catch (error) {
            console.error(`Search Query Error: ${error}`)
            throw new Error('Failed to execute search query')
        }
    }
}

module.exports = AuctionRepo
