const mongoose = require('mongoose')

/**
 * Schema for the Product model.
 */
const productSchema = new mongoose.Schema({
    /**
     * The name of the product.
     * @type {String}
     * @required
     */
    name: {
        type: String,
        required: true,
    },
    /**
     * The initial price of the product.
     * @type {Number}
     * @required
     * @min 0
     */
    initialPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    /**
     * The maximum price of the product.
     * @type {Number}
     * @required
     * @min 0
     */
    maxPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    /**
     * The quantity of the product.
     * @type {Number}
     * @required
     * @min 0
     */
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    /**
     * The description of the product.
     * @type {String}
     * @required
     */
    description: {
        type: String,
        required: true,
    },
    /**
     * Array of image URLs for the product.
     * @type {Array}
     */
    images: [
        {
            type: String,
            required: false,
        },
    ],
})

module.exports = mongoose.model('Product', productSchema)
