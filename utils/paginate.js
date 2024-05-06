/**
 * Paginates the results based on the request query parameters.
 * @param {object} req - The request object.
 * @param {number} [req.query.limit=50] - The maximum number of items per page.
 * @param {number} [req.query.page=1] - The page number.
 * @returns {object} An object containing the limit and skip values for pagination.
 */
const paginate = (req) => {
    const limit = req.query.limit || 50
    const page = req.query.page || 1
    const skip = (page - 1) * limit

    return { limit, skip }
}

module.exports = paginate
