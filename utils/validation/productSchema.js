const Joi = require('joi')

module.exports = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Name must be a string',
        'any.required': 'Name is required',
    }),
    initialPrice: Joi.number().required().min(1).messages({
        'number.base': 'Initial price must be a number',
        'any.required': 'Initial price is required',
        'number.min': 'Initial price must be at least 1 EGP',
    }),
    maxPrice: Joi.number().required().min(1).messages({
        'number.base': 'Max price must be a number',
        'any.required': 'Max price is required',
        'number.min': 'Max price must be at least 1 EGP',
    }),
    quantity: Joi.number().required().min(1).messages({
        'number.base': 'Quantity must be a number',
        'any.required': 'Quantity is required',
        'number.min': 'Quantity must be at least 1',
    }),
    description: Joi.string().trim().required().messages({
        'string.base': 'Description must be a string',
        'any.required': 'Description is required',
    }),
    images: Joi.array().items(Joi.string()).max(3).messages({
        'array.base': 'Images must be an array',
        'array.max': 'Maximum of 3 images allowed',
    }),
})
