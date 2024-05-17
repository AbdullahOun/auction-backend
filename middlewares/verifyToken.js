const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const { HTTP_STATUS_CODES, MODEL_MESSAGES } = require('../utils/constants')
const process = require('process')
require('dotenv').config()

/**
 * @description Middleware to verify JWT token from request headers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Function} - The next middleware function or an error.
 */
const verifyToken = (req, res, next) => {
    const authHeader =
        req.headers['Authorization'] || req.headers['authorization']

    if (!authHeader) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.tokenRequired,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        )
    }
    const token = authHeader.split(' ')[1]

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.decodedToken = decodedToken
        return next()
    } catch (err) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.invalidToken,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        )
    }
}

module.exports = verifyToken
