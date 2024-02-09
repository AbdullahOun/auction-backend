const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        // ref: 'Product'
    },
    url:{
        type: String,
        required: true
    }


})


module.exports = mongoose.model('Image',imageSchema);