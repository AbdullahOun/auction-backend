const multer = require('multer')
const AppError = require('../utils/appError')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')

/**
 * @description File filter function for multer to filter image files.
 * @param {Object} req - The request object.
 * @param {Object} file - The file object.
 * @param {Function} cb - The callback function.
 */
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0]
    if (imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(
            new AppError(
                MODEL_MESSAGES.file.onlyImages,
                HTTP_STATUS_CODES.BAD_REQUEST
            ),
            false
        )
    }
}

/**
 * @description Multer upload configuration.
 */
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
})

module.exports = upload
