const mongoose = require('mongoose')
const bidSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    auctionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Auction',
    },
    price: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model('Bid', bidSchema)
