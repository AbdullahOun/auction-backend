/**
 * @description Wraps an asynchronous function to handle errors asynchronously.
 * @param {Function} asyncFn - The asynchronous function to be wrapped.
 * @returns {Function} A middleware function that wraps the provided asynchronous function.
 */
module.exports = (asyncFn) => {
    /**
     * @description Middleware function that wraps the provided asynchronous function.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    return (req, res, next) => {
        asyncFn(req, res, next).catch((err) => {
            return next(err)
        })
    }
}
