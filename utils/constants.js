/**
 * HTTP status codes.
 * @typedef {Object} HTTP_STATUS_CODES
 * @property {number} OK - 200
 * @property {number} CREATED - 201
 * @property {number} OK - 204
 * @property {number} BAD_REQUEST - 400
 * @property {number} UNAUTHORIZED - 401
 * @property {number} FORBIDDEN - 403
 * @property {number} NOT_FOUND - 404
 * @property {number} INTERNAL_SERVER_ERROR - 500
 */

/**
 * Messages related to models.
 * @typedef {Object} MODEL_MESSAGES
 * @property {Object} user - Messages related to users.
 * @property {string} user.notFound - Message when user is not found.
 * @property {string} user.alreadyExists - Message when user already exists.
 * @property {string} user.invalidPassword - Message for invalid password.
 * @property {string} user.unauthorized - Message when user is not authorized.
 * @property {string} user.invalidToken - Message for invalid token.
 * @property {string} user.tokenRequired - Message when token is required.
 * @property {Object} product - Messages related to products.
 * @property {string} product.notFound - Message when product is not found.
 * @property {Object} auction - Messages related to auctions.
 * @property {string} auction.notFound - Message when auction is not found.
 * @property {Object} bid - Messages related to bids.
 * @property {string} bid.notFound - Message when bid is not found.
 * @property {Object} chatRoom - Messages related to chat rooms.
 * @property {string} chatRoom.notFound - Message when chat room is not found.
 * @property {Object} file - Messages related to files.
 * @property {string} file.missing - Message when file field is empty.
 * @property {string} file.onlyImages - Message when only images are allowed.
 * @property {Object} message - Messages related to messages.
 * @property {string} message.notFound - Message when message is not found.
 */

/** @type {HTTP_STATUS_CODES} */
const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

/** @type {MODEL_MESSAGES} */
const MODEL_MESSAGES = {
    user: {
        notFound: 'User not found',
        alreadyExists: 'User already exists',
        invalidPassword: 'Invalid password',
        unauthorized: 'User not authorized',
        invalidToken: 'Invalid token',
        tokenRequired: 'Token is required',
    },
    product: {
        notFound: 'Product not found',
    },
    auction: {
        notFound: 'Auction not found',
    },
    bid: {
        notFound: 'Bid not found',
    },
    chatRoom: {
        notFound: 'Chatroom not found',
    },
    file: {
        missing: 'File field is empty',
        onlyImages: 'Only images are allowed',
    },
    message: {
        notFound: 'Message not found',
    },
}

module.exports = { HTTP_STATUS_CODES, MODEL_MESSAGES }
