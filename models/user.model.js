const mongoose = require('mongoose')

/**
 * Subschema for user address.
 * @typedef {Object} Address
 * @property {string} [country] - The country of the address.
 * @property {string} [city] - The city of the address.
 * @property {string} [street] - The street of the address.
 * @property {string} [houseNumber] - The house number of the address.
 */

/**
 * User schema for storing user information.
 * @typedef {Object} User
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {number} phone - The phone number of the user. Must start with 010, 011, 012, or 015 and have 11 digits.
 * @property {string} email - The email address of the user. Must be unique and valid.
 * @property {string} password - The password of the user. Must be between 8 and 32 characters.
 * @property {string} [image] - The image URL of the user.
 * @property {Address} [address] - The address of the user.
 */

// Subschema for address
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

// Main user schema
const userSchema = mongoose.Schema({
    /**
     * The first name of the user.
     * @type {string}
     * @required
     */
    firstName: {
        type: String,
        required: true,
    },
    /**
     * The last name of the user.
     * @type {string}
     * @required
     */
    lastName: {
        type: String,
        required: true,
    },
    /**
     * The phone number of the user.
     * @type {string}
     * @required
     * @pattern /^(010|011|012|015)\d{8}$/
     */
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Check if the phone number format is valid (starting with 010, 011, 012, or 015 and 11 digits in total)
                const phoneRegex = /^(010|011|012|015)\d{8}$/
                return phoneRegex.test(value)
            },
            message:
                'Invalid phone number format. Phone numbers in Egypt must start with 010, 011, 012, or 015 and have 11 digits in total.',
        },
    },
    /**
     * The email address of the user.
     * @type {string}
     * @required
     * @unique
     * @format email
     */
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Check if the email format is valid
                const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
                return emailRegex.test(value)
            },
            message: 'Invalid email format',
        },
    },
    /**
     * The password of the user.
     * @type {string}
     * @required
     * @minLength 8
     * @maxLength 32
     */
    password: {
        type: String,
        required: true,
    },
    /**
     * The image URL of the user.
     * @type {string}
     */
    image: {
        type: String,
        required: false,
    },
    /**
     * The address of the user.
     * @type {Address}
     */
    address: {
        type: addressSchema,
        required: false,
    },
})

// Define unique indexes for email and phone
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ phone: 1 }, { unique: true })

module.exports = mongoose.model('User', userSchema)
