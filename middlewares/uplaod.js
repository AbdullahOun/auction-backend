const multer = require('multer')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')
const diskStorage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now() + Math.round(Math.random() * 1e9)}.${ext}`
        cb(null, fileName)
    },
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0]
    if (imageType === 'image') {
        return cb(null, true)
    } else {
        const error = appError.create(
            'Only images are allowed',
            400,
            httpStatusText.FAIL
        )
        return cb(error, false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter,
})

module.exports = { upload }
