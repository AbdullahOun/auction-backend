const paginate = (req) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50
    const page = req.query.page ? parseInt(req.query.page) : 1
    const skip = (page - 1) * limit

    return { limit, skip }
}

module.exports = paginate
