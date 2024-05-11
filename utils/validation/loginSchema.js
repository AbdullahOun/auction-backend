const Joi = require('joi')

module.exports = Joi.object({
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
