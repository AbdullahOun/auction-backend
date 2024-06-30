const jwt = require('jsonwebtoken')
const process = require('process')
require('dotenv').config()

module.exports = async function generateToken(payload) {
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d',
    })

    return token
}
