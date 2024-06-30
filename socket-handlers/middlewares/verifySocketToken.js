const jwt = require('jsonwebtoken')
const process = require('process')
const { logger } = require('../../utils/logging/logger')

const verifySocketToken = (socket, next) => {
    const token = socket.handshake.query.token

    if (!token) {
        return socket.emit('error', { error: 'Token is required' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        socket.decodedToken = decodedToken
        return next()
    } catch (err) {
        logger.info(err.message)
    }
}

module.exports = verifySocketToken
