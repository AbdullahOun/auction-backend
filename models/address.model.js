const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    houseNumber:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId
        
        //, ref:'User'
    }
    
    


})


module.exports = mongoose.model('Address',addressSchema);