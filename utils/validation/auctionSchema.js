const Joi = require('joi')

// .min('now')    'date.min': 'Start date must be in the future',

module.exports = Joi.object({
    startDate: Joi.date().required().messages({
        'date.base': 'Start date must be a valid date',
        'any.required': 'Start date is required',
    }),
    endDate: Joi.date().required().min(Joi.ref('startDate')).messages({
        'date.base': 'End date must be a valid date',
        'any.required': 'End date is required',
        'date.min': 'End date must be after the start date',
    }),
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
    images: Joi.array().items(Joi.string().uri().trim()).messages({
        'array.base': 'Images must be an array',
        'string.uri': 'Each image must be a valid URL',
    }),
    tags: Joi.array().items(Joi.string()).messages({
        'array.base': 'Images must be an array',
    }),
    seller: Joi.string().trim().required().messages({
        'string.base': 'Seller ID must be a string',
        'any.required': 'Seller ID is required',
    }),
})
