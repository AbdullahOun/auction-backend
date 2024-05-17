const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')
const deleteFromS3 = require('../utils/storage/deleteFromS3')
const uploadToS3 = require('../utils/storage/uploadToS3')

class Create {
    /**
     * Handle single image upload
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static upload = asyncWrapper(async (req, res, next) => {
        if (!req.file) {
            throw new AppError(
                MODEL_MESSAGES.file.missing,
                HTTP_STATUS_CODES.BAD_REQUEST
            )
        }
        const response = await uploadToS3(req.file)
        res.status(HTTP_STATUS_CODES.CREATED).json(
            new AppResponse({ imageUrl: response.Location })
        )
    })
}

class Delete {
    /**
     * Handle single image delete.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static remove = asyncWrapper(async (req, res, next) => {
        const imagePath = req.params.imagePath
        await deleteFromS3([imagePath])
        res.status(HTTP_STATUS_CODES.CREATED).json(new AppResponse(null))
    })
}

module.exports = {
    Create,
    Delete,
}
