const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')
const uploadImage = asyncWrapper(async (req, res, next) => {
    if (!req.file) {
        const error = appError.create(
            'You must add a file',
            400,
            httpStatusText.FAIL
        )
        next(error)
        return
    }
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { imageUrl: req.file.filename },
        error: null,
    })
})

module.exports = {
    uploadImage,
}
