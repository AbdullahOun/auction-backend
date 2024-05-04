const Image = require('../models/image.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

/**
 * Retrieves all images for a specific product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllImages = asyncWrapper(
    async (req, res, next) => {
        const images = await Image.find({ productId: req.params.product_Id }, { "__v": false });
        res.json({ status: httpStatusText.SUCCESS, data: { images }, error: null });
    }
);

/**
 * Retrieves an image by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getImage = asyncWrapper(
    async (req, res, next) => {
        const image = await Image.findById(req.params.imageId);
        if (!image) {
            const error = appError.create('Image not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { image }, error: null });
    }
);

/**
 * Creates a new image.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createImage = asyncWrapper(
    async (req, res, next) => {
        const newImage = new Image(req.body);
        await newImage.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newImage }, error: null });
    }
);

/**
 * Updates an image.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateImage = asyncWrapper(
    async (req, res, next) => {
        const imageId = req.params.imageId;
        await Image.updateOne({ _id: imageId }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

/**
 * Deletes an image by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteImage = asyncWrapper(
    async (req, res, next) => {
        const imageId = req.params.imageId;
        const data = await Image.deleteOne({ _id: imageId });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getAllImages,
    getImage,
    createImage,
    updateImage,
    deleteImage
};
