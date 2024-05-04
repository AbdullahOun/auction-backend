
const crypto = require('node:crypto')

const KEYLEN = +process.env.KEYLEN;
const SALT = process.env.SALT;
function hashPassword(password) {
    return  crypto.scryptSync(password,  SALT,KEYLEN).toString('hex');
}

 function verifyPassword(password , userPassword) {
    hashedPassword =  hashPassword(password);
    return hashedPassword == userPassword
}

module.exports = {
    hashPassword,
    verifyPassword
}