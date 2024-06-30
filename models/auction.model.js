const mongoose = require('mongoose')

/**
 * Mongoose schema definition for an Auction.
 * @typedef {import('mongoose').Schema<Document<any, any, any>, import('mongoose').Model<Document<any, any, any>>, undefined, any>} MongooseSchema
 */

/**
 * @type {MongooseSchema}
 */
const auctionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        initialPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        maxPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
        },
        tags: [{ type: String, required: false }],
        images: [
            {
                type: String,
                required: false,
            },
        ],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value >= this.startDate
                },
                message: 'End date must be after the start date',
            },
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value)
                    return user !== null
                },
                message: 'Seller does not exist',
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
)

/**
 * Virtual property that calculates the status of the auction based on current date.
 * @name auctionSchema#status
 * @type {string}
 */
auctionSchema.virtual('status').get(function () {
    const now = new Date()
    const startDate = this.startDate
    const endDate = this.endDate

    if (now < startDate) {
        return 'pending'
    } else if (now >= startDate && now <= endDate) {
        return 'running'
    } else {
        return 'ended'
    }
})

/**
 * Index definition for text search on auction name.
 * @name auctionSchema.indexes
 * @type {Object}
 */
auctionSchema.index(
    { name: 'text' },
    {
        default_language: 'english',
        textIndexVersion: 3,
        minLength: 1,
    }
)

module.exports = mongoose.model('Auction', auctionSchema)
