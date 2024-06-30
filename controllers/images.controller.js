const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const { HTTP_STATUS_CODES } = require('../utils/constants')
const { logger } = require('../utils/logging/logger')

/**
 * Controller class for handling image upload and deletion operations.
 */
class ImagesController {
    /**
     * Initializes the ImagesController with S3 utility for image operations.
     * @param {object} s3Util - Utility object for S3 operations.
     */
    constructor(s3Util) {
        this.s3Util = s3Util
    }

    /**
     * Uploads an image to S3 storage.
     * @param {object} req - Express request object containing the file to upload.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the uploaded image URL.
     * @throws {AppError} Throws an error if file is missing or upload fails.
     */
    upload = async (req, res, next) => {
        try {
            if (!req.file) {
                return next(AppError('File is missing', HTTP_STATUS_CODES.BAD_REQUEST))
            }
            const response = await this.s3Util.upload(req.file)
            return res.status(HTTP_STATUS_CODES.CREATED).json(new AppResponse({ imageUrl: response.Location }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Deletes an image from S3 storage.
     * @param {object} req - Express request object containing the image path to delete.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response indicating success.
     * @throws {AppError} Throws an error if deletion fails.
     */
    delete = async (req, res, next) => {
        try {
            const imagePath = req.params.imagePath
            await this.s3Util.delete([imagePath])
            return res.status(HTTP_STATUS_CODES.CREATED).json(new AppResponse(null))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }
}

module.exports = ImagesController
