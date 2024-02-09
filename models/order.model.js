const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
        // ,
        // ref: 'User'
    },
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
        // ,
        // ref: 'User'
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
        // ,
        // ref: 'Product'
    },
    price:{
        type: Number,
        required: true
    }
    


})


module.exports = mongoose.model('Order',orderSchema);