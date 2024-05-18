const mongoose = require('mongoose')

/**
 * Schema for the Bid model.
 */
const bidSchema = new mongoose.Schema(
    {
        /**
         * The buyer of the bid.
         * @type {mongoose.Schema.Types.ObjectId}
         * @required
         * @ref User
         * @validate Custom validator to check if the buyer ID exists in the User collection
         */
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value)
                    return user !== null
                },
                message: 'Buyer does not exist',
            },
        },
        /**
         * The auction associated with the bid.
         * @type {mongoose.Schema.Types.ObjectId}
         * @required
         * @ref Auction
         * @validate Custom validator to check if the auction ID exists in the Auction collection
         */
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Auction',
            validate: {
                validator: async function (value) {
                    const auction = await mongoose
                        .model('Auction')
                        .findById(value)
                    return auction !== null
                },
                message: 'Auction does not exist',
            },
        },
        /**
         * The price of the bid.
         * @type {Number}
         * @required
         * @validate Custom validator to check if the price is valid (greater than 0)
         */
        price: {
            type: Number,
            required: true,
            validate: {
                validator: function (value) {
                    return value > 1
                },
                message: 'Price must be greater than 1',
            },
        },
    },
    {
        /**
         * Adds createdAt and updatedAt fields to the schema.
         */
        timestamps: true,
    }
)

bidSchema.post('save', async function (doc, next) {
    await doc
        .populate('auction')
        .populate({
            path: 'buyer',
            select: '-password',
        })
        .execPopulate()
    next()
})

module.exports = mongoose.model('Bid', bidSchema)
