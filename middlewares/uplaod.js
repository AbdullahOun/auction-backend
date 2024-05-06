const multer = require('multer')
const AppError = require('../utils/appError')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')

/**
 * Disk storage configuration for multer.
 */
const diskStorage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now() + Math.round(Math.random() * 1e9)}.${ext}`
        cb(null, fileName)
    },
})

/**
 * File filter function for multer to filter image files.
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
 * Multer upload configuration.
 */
const upload = multer({
    storage: diskStorage,
    fileFilter,
})

module.exports = { upload }
