const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const { HTTP_STATUS_CODES } = require('../utils/constants')
const process = require('process')
const { logger } = require('../utils/logging/logger')

require('dotenv').config()

/**
 * Middleware function to verify JWT token from Authorization header.
 * Sets decoded token in req.decodedToken if valid.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {void}
 * @throws {AppError} - Throws unauthorized error if token is missing or invalid.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']

    if (!authHeader) {
        return next(new AppError('Token is required', HTTP_STATUS_CODES.UNAUTHORIZED))
    }
    const token = authHeader.split(' ')[1]

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.decodedToken = decodedToken
        return next()
    } catch (err) {
        logger.error(err.message)
        return next(new AppError('Invalid token', HTTP_STATUS_CODES.UNAUTHORIZED))
    }
}

module.exports = verifyToken
