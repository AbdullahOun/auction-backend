const mongoose = require('mongoose');
const auctionSchema = new mongoose.Schema({
    startdate: {
        type:  Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
        // ,
        // ref: 'Product'
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
        // ,
        // ref: 'User'
    }
})


module.exports = mongoose.model('Auction',auctionSchema);