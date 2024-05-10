const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')
const deleteImage = require('../utils/deleteImages')
/**
 * Middleware to handle image uploads.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const uploadImage = asyncWrapper(async (req, res, next) => {
    // Check if a file was uploaded
    if (!req.file) {
        // If no file was uploaded, return an error response
        next(
            new AppError(
                MODEL_MESSAGES.file.missing,
                HTTP_STATUS_CODES.BAD_REQUEST
            )
        )
        return
    }
    // If a file was uploaded successfully, return the image URL in the response
    res.status(HTTP_STATUS_CODES.CREATED).json(
        new AppResponse({ imageUrl: req.file.filename })
    )
})
const removeImage = asyncWrapper(async (req, res, next) => {
    const imagePath = req.params.imagePath
    await deleteImage([imagePath])
    res.status(HTTP_STATUS_CODES.CREATED).json(new AppResponse(null))
})

module.exports = {
    uploadImage,
    removeImage,
}
