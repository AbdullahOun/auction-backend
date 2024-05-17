const jwt = require('jsonwebtoken')
const process = require('process')

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
        return socket.emit('error', { error: 'Token is corrupted' })
    }
}

module.exports = verifySocketToken
