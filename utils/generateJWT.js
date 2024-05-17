const jwt = require('jsonwebtoken')
const process = require('process')
require('dotenv').config()

/**
 * Generates a JWT token with the provided payload.
 * @param {object} payload - The payload to be included in the token.
 * @returns {Promise<string>} A Promise that resolves with the generated JWT token.
 */
module.exports = async function generateToken(payload) {
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d',
    })

    return token
}
