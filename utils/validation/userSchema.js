const Joi = require('joi')
const addressSchema = Joi.object({
    country: Joi.string().trim().empty().allow('').messages({
        'string.base': 'Country must be a string',
        'string.empty': 'Country cannot be empty',
    }),
    city: Joi.string().trim().empty().allow('').messages({
        'string.base': 'City must be a string',
        'string.empty': 'City cannot be empty',
    }),
    street: Joi.string().trim().empty().allow('').messages({
        'string.base': 'Street must be a string',
        'string.empty': 'Street cannot be empty',
    }),
    houseNumber: Joi.string().trim().empty().allow('').messages({
        'string.base': 'House number must be a string',
        'string.empty': 'House number cannot be empty',
    }),
})

module.exports = Joi.object({
    firstName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'First name must be a string',
            'string.empty': 'First name cannot be empty',
            'string.pattern.base': 'First name must contain only English alphabet characters',
            'any.required': 'First name is required',
        }),
    lastName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'Last name must be a string',
            'string.empty': 'Last name cannot be empty',
            'string.pattern.base': 'Last name must contain only English alphabet characters',
            'any.required': 'Last name is required',
        }),
    phone: Joi.string()
        .trim()
        .pattern(/^(010|011|012|015)\d{8}$/)
        .messages({
            'string.base': 'Phone number must be a string',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base':
                'Invalid phone number format. Phone number must start with 010, 011, 012, or 015 followed by 8 digits',
            'any.required': 'Phone number is required',
        }),
    email: Joi.string().trim().email().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    image: Joi.string().trim().uri().messages({
        'string.base': 'Image must be a string',
        'string.empty': 'Image cannot be empty',
        'string.uri': 'Image must be a valid URL',
    }),
    address: addressSchema,
})
