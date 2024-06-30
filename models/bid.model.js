const mongoose = require('mongoose')

/**
 * Mongoose schema definition for a Bid.
 * @typedef {import('mongoose').Schema<Document<any, any, any>, import('mongoose').Model<Document<any, any, any>>, undefined, any>} MongooseSchema
 */

/**
 * @type {MongooseSchema}
 */
const bidSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
                /**
                 * Asynchronous validator function to check if the buyer exists.
                 * @param {mongoose.Schema.Types.ObjectId} value - The buyer's ObjectId.
                 * @returns {Promise<boolean>} Whether the buyer exists.
                 */
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value)
                    return user !== null
                },
                message: 'Buyer does not exist',
            },
        },
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Auction',
            validate: {
                /**
                 * Asynchronous validator function to check if the auction exists.
                 * @param {mongoose.Schema.Types.ObjectId} value - The auction's ObjectId.
                 * @returns {Promise<boolean>} Whether the auction exists.
                 */
                validator: async function (value) {
                    const auction = await mongoose.model('Auction').findById(value)
                    return auction !== null
                },
                message: 'Auction does not exist',
            },
        },
        price: {
            type: Number,
            required: true,
            validate: {
                /**
                 * Validator function to check if the price is greater than 1.
                 * @param {number} value - The price value.
                 * @returns {boolean} Whether the price is valid.
                 */
                validator: function (value) {
                    return value > 1
                },
                message: 'Price must be greater than 1',
            },
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Bid', bidSchema)
