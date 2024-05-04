const Auction = require('../models/auction.model');
const Product = require('../models/product.model');
const Image = require('../models/image.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

/**
 * Retrieves all auctions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllAuctions = asyncWrapper(
    async (req, res, next) => {
        const limit = req.query.limit || 6;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;
        const auctions = await Auction.find({}, { "__v": false }).limit(limit).skip(skip);
        res.json({ status: "success", data: { auctions }, error: null });
    }
);

/**
 * Retrieves all auctions for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllAuctionsForUser = asyncWrapper(
    async (req, res, next) => {
        const auctions = await Auction.find({ sellerId: req.decodedToken.id }, { "__v": false });
        res.json({ status:  httpStatusText.SUCCESS, data: { auctions }, error: null });
    }
);

/**
 * Retrieves an auction by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAction = asyncWrapper(
    async (req, res, next) => {
        const action = await Action.findOne({ productId: req.params.product_Id });
        if (!action) {
            const error = appError.create('Action not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { action }, error: null });
    }
);

/**
 * Creates a new auction and associated product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createAction = asyncWrapper(
    async (req, res, next) => {
        const product = {
            name: req.body.name,
            initialPrice: req.body.initialPrice,
            maxPrice: req.body.maxPrice,
            quantity: req.body.quantity,
            description: req.body.description,
            categoryId: req.body.categoryId
        };
        let newProduct = new Product(product);
        await newProduct.save();

        const images = req.files;
        for (let i = 0; i < images.length; i++) {
            const newImage = new Image({ productId: newProduct._id, url: images[i].filename });
            await newImage.save();
        }

        const auction = {
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            productId: newProduct._id,
            price: req.body.maxPrice,
            sellerId: req.decodedToken.id
        };

        const newAction = new Auction(auction);
        await newAction.save();

        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newAction }, error: null });
    }
);

/**
 * Updates an auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateAction = asyncWrapper(
    async (req, res, next) => {
        const actionId = req.params.actionId;
        await Auction.updateOne({ _id: actionId }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

/**
 * Deletes an auction.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteAction = asyncWrapper(
    async (req, res, next) => {
        const actionId = req.params.actionId;
        await Auction.deleteOne({ _id: actionId });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getAllAuctions,
    getAllAuctionsForUser,
    getAction,
    createAction,
    updateAction,
    deleteAction
};
