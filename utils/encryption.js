const crypto = require('node:crypto')
const process = require('process')
require('dotenv').config()

const KEYLEN = +process.env.KEYLEN

const SALT = process.env.SALT

function hashPassword(password) {
    return crypto.scryptSync(password, SALT, KEYLEN).toString('hex')
}

function verifyPassword(password, userPassword) {
    const hashedPassword = hashPassword(password)
    return crypto.timingSafeEqual(new ArrayBuffer(hashedPassword), new ArrayBuffer(userPassword))
}

module.exports = {
    hashPassword,
    verifyPassword,
}
