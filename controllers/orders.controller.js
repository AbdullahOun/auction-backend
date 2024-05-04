const { validationResult } = require('express-validator');
const Order = require('../models/order.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

/**
 * Retrieves all orders for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllOrder = asyncWrapper(
    async (req, res, next) => {
        const orders = await Order.find({ buyerId: req.decodedToken.id });
        res.json({ status: httpStatusText.SUCCESS, data: { orders }, error: null });
    }
);

/**
 * Retrieves an order by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getOrder = asyncWrapper(
    async (req, res, next) => {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            const error = appError.create('Order not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { order }, error: null });
    }
);

/**
 * Creates a new order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createOrder = asyncWrapper(
    async (req, res, next) => {
        const newOrder = new Order({ price: req.body.price, productId: req.body.productId, buyerId: req.decodedToken.id, sellerId: req.body.sellerId });
        await newOrder.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newOrder }, error: null });
    }
);

/**
 * Updates an order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateOrder = asyncWrapper(
    async (req, res, next) => {
        const orderId = req.params.orderId;
        await Order.updateOne({ _id: orderId }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

/**
 * Deletes an order by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteOrder = asyncWrapper(
    async (req, res, next) => {
        const orderId = req.params.orderId;
        await Order.deleteOne({ _id: orderId });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrder
};
