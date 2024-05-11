const mongoose = require('mongoose')

/**
 * Schema for Auction model.
 */
const auctionSchema = new mongoose.Schema(
    {
        /**
         * Start date of the auction.
         * @type {Date}
         * @required
         * @validate Custom validator to check if the start date is in the future
         */
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value >= new Date()
                },
                message: 'Start date must be in the future',
            },
        },
        /**
         * End date of the auction.
         * @type {Date}
         * @required
         * @validate Custom validator to check if the end date is after the start date
         */
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
        /**
         * Product associated with the auction.
         * @type {mongoose.Schema.Types.ObjectId}
         * @required
         * @ref Product
         */
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        /**
         * Seller of the auction.
         * @type {mongoose.Schema.Types.ObjectId}
         * @required
         * @ref User
         * @validate Custom validator to check if the seller ID exists in the User collection
         */
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
        /**
         * Adds createdAt and updatedAt fields to the schema.
         */
        timestamps: true,
        toJSON: { virtuals: true },
    }
)

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

// Define a unique index for the product field
auctionSchema.index({ product: 1 }, { unique: true })

module.exports = mongoose.model('Auction', auctionSchema)
