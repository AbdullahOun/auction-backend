const Address = require('../models/address.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

/**
 * Retrieves the address associated with the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAddress = asyncWrapper(
    async (req, res, next) => {
        const address = await Address.findOne({ userId: req.decodedToken.id });
        if (!address) {
            const error = appError.create('Address not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { address }, error: null });
    }
);

/**
 * Creates a new address for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createAddress = asyncWrapper(
    async (req, res, next) => {
        const newAddress = new Address({
            country: req.body.country,
            city: req.body.city,
            street: req.body.street,
            houseNumber: req.body.houseNumber,
            userId: req.decodedToken.id
        });
        await newAddress.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newAddress }, error: null });
    }
);

/**
 * Updates the address associated with the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateAddress = asyncWrapper(
    async (req, res, next) => {
        const userId = req.decodedToken.id;
        await Address.updateOne({ userId: userId }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

/**
 * Deletes the address associated with the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteAddress = asyncWrapper(
    async (req, res, next) => {
        const userId = req.decodedToken.id;
        await Address.deleteOne({ userId: userId });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress
};
