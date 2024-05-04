const mongoose = require('mongoose')
const validator = require('validator')
const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    street: {
        type: String,
        required: false,
    },
    houseNumber: {
        type: String,
        required: false,
    },
})

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    address: {
        type: addressSchema,
        required: false,
    },
})

module.exports = mongoose.model('User', userSchema)
