const mongoose = require('mongoose')
const process = require('process')
require('dotenv').config()

/**
 * Schema definition for the Address sub-document.
 * @typedef {import('mongoose').Schema<Document<any, any, any>, import('mongoose').Model<Document<any, any, any>>, undefined, any>} MongooseSchema
 */

/**
 * @type {MongooseSchema}
 */
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

/**
 * Schema definition for the User model.
 * @typedef {import('mongoose').Schema<Document<any, any, any>, import('mongoose').Model<Document<any, any, any>>, undefined, any>} MongooseSchema
 */

/**
 * @type {MongooseSchema}
 */
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
        type: String,
        required: true,
        validate: {
            /**
             * Validator function for phone number format.
             * @param {string} value - The phone number to validate.
             * @returns {boolean} Whether the phone number matches the expected format.
             */
            validator: function (value) {
                const phoneRegex = /^(010|011|012|015)\d{8}$/
                return phoneRegex.test(value)
            },
            message:
                'Invalid phone number format. Phone numbers in Egypt must start with 010, 011, 012, or 015 and have 11 digits in total.',
        },
    },

    email: {
        type: String,
        required: true,
        validate: {
            /**
             * Validator function for email format.
             * @param {string} value - The email to validate.
             * @returns {boolean} Whether the email matches the expected format.
             */
            validator: function (value) {
                const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
                return emailRegex.test(value)
            },
            message: 'Invalid email format',
        },
    },

    password: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: false,
        default: process.env.DEFAULT_USER_IMAGE_URL,
    },
    address: {
        type: addressSchema,
        required: false,
    },
})

// Index definitions
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ phone: 1 }, { unique: true })

module.exports = {
    User: mongoose.model('User', userSchema),
    AddressSchema: addressSchema,
}
