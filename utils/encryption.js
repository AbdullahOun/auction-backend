const crypto = require('node:crypto')
const process = require('process')
require('dotenv').config()
/**
 * The length of the key used for hashing passwords.
 * @type {number}
 */
const KEYLEN = +process.env.KEYLEN

/**
 * The salt used for hashing passwords.
 * @type {string}
 */
const SALT = process.env.SALT

/**
 * Hashes a password using scrypt algorithm.
 * @param {string} password - The password to be hashed.
 * @returns {string} The hashed password.
 */
function hashPassword(password) {
    return crypto.scryptSync(password, SALT, KEYLEN).toString('hex')
}

/**
 * Verifies a password by comparing it with a hashed password.
 * @param {string} password - The password to be verified.
 * @param {string} userPassword - The hashed password to compare against.
 * @returns {boolean} True if the password matches the hashed password, otherwise false.
 */
function verifyPassword(password, userPassword) {
    const hashedPassword = hashPassword(password)
    return crypto.timingSafeEqual(
        new ArrayBuffer(hashedPassword),
        new ArrayBuffer(userPassword)
    )
}

module.exports = {
    hashPassword,
    verifyPassword,
}
