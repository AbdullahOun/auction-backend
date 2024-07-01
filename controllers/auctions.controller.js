const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const paginate = require('../utils/paginate')
const { HTTP_STATUS_CODES } = require('../utils/constants')
const auctionSchema = require('../utils/validation/auctionSchema')
const { logger } = require('../utils/logging/logger')

/**
 * Controller class for handling auction operations.
 */
class AuctionController {
    /**
     * Initializes the AuctionController with repositories and utility services.
     * @param {object} auctionRepo - Repository handling auction data.
     * @param {object} s3Util - Utility for interacting with AWS S3.
     */
    constructor(auctionRepo, s3Util) {
        this.auctionRepo = auctionRepo
        this.s3Util = s3Util
    }

    /**
     * Get all auctions based on query parameters.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing auctions.
     * @throws {AppError} Throws an error if retrieval fails.
     */
    getAll = async (req, res, next) => {
        try {
            const { limit, skip } = paginate(req)
            const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null
            const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null
            const minStartDate = req.query.min_start_date ? new Date(req.query.min_start_date) : null
            const maxStartDate = req.query.max_start_date ? new Date(req.query.max_start_date) : null
            const tags = req.query.tags ? req.query.tags.split(',') : null

            const auctions = await this.auctionRepo.getAll(
                limit,
                skip,
                null,
                minPrice,
                maxPrice,
                tags,
                minStartDate,
                maxStartDate
            )
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auctions }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Get all auctions by user ID based on query parameters.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing auctions.
     * @throws {AppError} Throws an error if retrieval fails.
     */
    getAllByUserId = async (req, res, next) => {
        try {
            const { limit, skip } = paginate(req)
            const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null
            const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null
            const minStartDate = req.query.min_start_date ? new Date(req.query.min_start_date) : null
            const maxStartDate = req.query.max_start_date ? new Date(req.query.max_start_date) : null
            const tags = req.query.tags ? req.query.tags.split(',') : null

            const userId = req.decodedToken.id

            const auctions = await this.auctionRepo.getAll(
                limit,
                skip,
                userId,
                minPrice,
                maxPrice,
                tags,
                minStartDate,
                maxStartDate
            )
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auctions }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Get auction by ID.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the auction.
     * @throws {AppError} Throws an error if auction is not found or retrieval fails.
     */
    getById = async (req, res, next) => {
        try {
            const auctionId = req.params.auctionId
            const auction = await this.auctionRepo.getById(auctionId)
            if (!auction) {
                return next(new AppError('Auction not found', HTTP_STATUS_CODES.NOT_FOUND))
            }
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auction }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Create a new auction.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the created auction.
     * @throws {AppError} Throws an error if creation fails or validation fails.
     */
    create = async (req, res, next) => {
        let body = {}
        try {
            const userId = req.decodedToken.id
            body = {
                name: req.body.name,
                initialPrice: req.body.initialPrice,
                maxPrice: req.body.maxPrice,
                quantity: req.body.quantity,
                description: req.body.description,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                seller: userId,
            }

            if (req.body.tags && req.body.tags.length > 0) {
                body.tags = req.body.tags.split(',')
            } else {
                body.tags = []
            }

            const uploadPromises = req.files.map(async (file) => {
                return this.s3Util.upload(file)
            })
            const images = await Promise.all(uploadPromises)
            body.images = images
            let validatedBody
            try {
                validatedBody = await auctionSchema.validateAsync(body)
            } catch (err) {
                logger.error(err.message)
                return next(new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST))
            }

            let auction = await this.auctionRepo.create(validatedBody)
            return res.status(HTTP_STATUS_CODES.CREATED).json(new AppResponse({ auction }))
        } catch (err) {
            if (body.images) {
                await this.s3Util.delete(body.images)
            }
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Update an existing auction.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the updated auction.
     * @throws {AppError} Throws an error if update fails or validation fails.
     */
    update = async (req, res, next) => {
        let body = {}
        try {
            const auctionId = req.params.auctionId
            const userId = req.decodedToken.id
            body = {
                name: req.body.name,
                initialPrice: req.body.initialPrice,
                maxPrice: req.body.maxPrice,
                quantity: req.body.quantity,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            }

            if (req.body.tags && req.body.tags.length > 0) {
                body.tags = req.body.tags.split(',')
            } else {
                body.tags = []
            }

            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(async (file) => {
                    return this.s3Util.upload(file)
                })
                const images = await Promise.all(uploadPromises)
                body.images = images
            }

            let validatedBody

            try {
                validatedBody = await auctionSchema.validateAsync(body)
            } catch (err) {
                logger.error(err.message)
                return next(new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST))
            }

            let auction = await this.auctionRepo.update(auctionId, userId, validatedBody)
            if (!auction) {
                return next(
                    new AppError(
                        'Auction not found or user does not have permission to update it',
                        HTTP_STATUS_CODES.FORBIDDEN
                    )
                )
            }
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auction }))
        } catch (err) {
            if (body.images) {
                await this.s3Util.delete(body.images)
            }
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Delete an existing auction.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the deleted auction.
     * @throws {AppError} Throws an error if deletion fails.
     */
    delete = async (req, res, next) => {
        let auction = {}
        try {
            const auctionId = req.params.auctionId
            const userId = req.decodedToken.id
            auction = await this.auctionRepo.delete(auctionId, userId)
            if (!auction) {
                return next(
                    new AppError(
                        'Auction not found or user does not have permission to delete it',
                        HTTP_STATUS_CODES.FORBIDDEN
                    )
                )
            }
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ auction }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        } finally {
            if (auction && auction.images) {
                await this.s3Util.delete(auction.images)
            }
        }
    }
}
module.exports = AuctionController
