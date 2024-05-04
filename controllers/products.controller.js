const { validationResult } = require('express-validator');
const Product = require('../models/product.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');


/**
 * Retrieves all products with pagination support.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllProducts = asyncWrapper(
    async (req, res, next) => {
        const limit = req.query.limit || 6;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;
        const products = await Product.find({}, { "__v": false }).limit(limit).skip(skip);
        res.json({ status: httpStatusText.SUCCESS, data: { products }, error: null });
    }
);

/**
 * Retrieves a product by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getProduct = asyncWrapper(
    async (req, res, next) => {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            const error = appError.create('Product not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { product }, error: null });
    }
);

/**
 * Creates a new product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createProduct = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
        }
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newProduct }, error: null });
    }
);

/**
 * Updates a product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateProduct = asyncWrapper(
    async (req, res, next) => {
        const productId = req.params.productId;
        await Product.updateOne({ _id: productId }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

/**
 * Deletes a product by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteProduct = asyncWrapper(
    async (req, res, next) => {
        const productId = req.params.productId;
        await Product.deleteOne({ _id: productId });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
