const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
        // match: [/.+@.+\..+/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }





})

module.exports = mongoose.model('User',userSchema);