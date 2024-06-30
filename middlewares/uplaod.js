const multer = require('multer')
const AppError = require('../utils/appError')
const { HTTP_STATUS_CODES } = require('../utils/constants')

/**
 * Function to filter uploaded files based on their mimetype.
 * Allows only 'image/*' types.
 * @param {object} req - Express request object.
 * @param {object} file - Uploaded file object.
 * @param {Function} cb - Callback function (cb(error, boolean)).
 */
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0]
    if (imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(new AppError('Only images are allowed', HTTP_STATUS_CODES.BAD_REQUEST), false)
    }
}

/**
 * Multer configuration for handling file uploads.
 * Uses memory storage and the defined file filter.
 */
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
})

module.exports = upload
