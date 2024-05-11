const Joi = require('joi')

module.exports = Joi.object({
    firstName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
            'string.base': 'First name must be a string',
            'string.empty': 'First name cannot be empty',
            'string.pattern.base':
                'First name must contain only English alphabet characters',
            'any.required': 'First name is required',
        }),
    lastName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
            'string.base': 'Last name must be a string',
            'string.empty': 'Last name cannot be empty',
            'string.pattern.base':
                'Last name must contain only English alphabet characters',
            'any.required': 'Last name is required',
        }),
    phone: Joi.string()
        .trim()
        .pattern(/^(010|011|012|015)\d{8}$/)
        .required()
        .messages({
            'string.base': 'Phone number must be a string',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base':
                'Invalid phone number format. Phone number must start with 010, 011, 012, or 015 followed by 8 digits',
            'any.required': 'Phone number is required',
        }),
    email: Joi.string().trim().email().required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().trim().min(8).max(32).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be at most 32 characters long',
        'any.required': 'Password is required',
    }),
})
