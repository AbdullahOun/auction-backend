const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
        initialPrice:{
        type: Number,
        required:true
    },
    maxPrice:{
        type: Number,
        required:true
    },
    quantity:{
        type: Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categoryId:{
        type:String,
        required:false
    }
})


module.exports = mongoose.model('Product',productSchema);