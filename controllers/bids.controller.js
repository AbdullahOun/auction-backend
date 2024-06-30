const AppResponse = require('../utils/appResponse')
const AppError = require('../utils/appError')
const paginate = require('../utils/paginate')
const { HTTP_STATUS_CODES } = require('../utils/constants')
const { logger } = require('../utils/logging/logger')

/**
 * Controller class for handling bid operations.
 */
class BidsController {
    /**
     * Initializes the BidsController with a repository for bid operations.
     * @param {object} bidsRepo - Repository handling bid data.
     */
    constructor(bidsRepo) {
        this.bidsRepo = bidsRepo
    }

    /**
     * Get all bids for a specific auction.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing bids.
     * @throws {AppError} Throws an error if retrieval fails.
     */
    getAll = async (req, res, next) => {
        try {
            const { limit, skip } = paginate(req)
            const auctionId = req.params.auctionId

            const bids = await this.bidsRepo.getAll(auctionId, limit, skip)

            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ bids }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Get a bid by its ID.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the bid.
     * @throws {AppError} Throws an error if bid is not found or retrieval fails.
     */
    getById = async (req, res, next) => {
        try {
            const bidId = req.params.bidId
            const bid = await this.bidsRepo.getById(bidId)

            if (!bid) {
                return next(new AppError('Bid not found', HTTP_STATUS_CODES.NOT_FOUND))
            }

            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ bid }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Get the top bid for a specific auction.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the top bid.
     * @throws {AppError} Throws an error if retrieval fails.
     */
    getTop = async (req, res, next) => {
        try {
            const auctionId = req.params.auctionId
            const bid = await this.bidsRepo.getTop(auctionId)
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ bid }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Delete a bid by its ID, if the user has permission.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the deleted bid.
     * @throws {AppError} Throws an error if deletion fails or user does not have permission.
     */
    delete = async (req, res, next) => {
        try {
            const bidId = req.params.bidId
            const userId = req.decodedToken.id
            const bid = await this.bidsRepo.delete(bidId, userId)
            if (!bid) {
                return next(
                    new AppError(
                        'Bid not found or user does not have permission to delete it',
                        HTTP_STATUS_CODES.FORBIDDEN
                    )
                )
            }
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ bid }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }
}

module.exports = BidsController
