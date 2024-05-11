const Joi = require('joi')

module.exports = Joi.object({
    startDate: Joi.date().required().min('now').messages({
        'date.base': 'Start date must be a valid date',
        'any.required': 'Start date is required',
        'date.min': 'Start date must be in the future',
    }),
    endDate: Joi.date().required().min(Joi.ref('startDate')).messages({
        'date.base': 'End date must be a valid date',
        'any.required': 'End date is required',
        'date.min': 'End date must be after the start date',
    }),
    product: Joi.string().trim().required().messages({
        'string.base': 'Product ID must be a string',
        'any.required': 'Product ID is required',
    }),
    seller: Joi.string().trim().required().messages({
        'string.base': 'Seller ID must be a string',
        'any.required': 'Seller ID is required',
    }),
})
