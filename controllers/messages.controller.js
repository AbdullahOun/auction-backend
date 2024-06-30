const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const paginate = require('../utils/paginate')
const { HTTP_STATUS_CODES } = require('../utils/constants')
const { logger } = require('../utils/logging/logger')

/**
 * Controller class for handling messages in a chat room.
 */
class MessagesController {
    /**
     * Initializes the MessagesController with repositories for messages and chat rooms.
     * @param {object} messagesRepo - Repository for handling message data operations.
     * @param {object} chatRoomsRepo - Repository for handling chat room data operations.
     */
    constructor(messagesRepo, chatRoomsRepo) {
        this.messagesRepo = messagesRepo
        this.chatRoomsRepo = chatRoomsRepo
    }

    /**
     * Retrieves all messages in a specified chat room.
     * @param {object} req - Express request object containing parameters for pagination and chat room ID.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing messages, total message count, and pagination details.
     * @throws {AppError} Throws an error if chat room is not found, user is unauthorized, or if an internal server error occurs.
     */
    getAll = async (req, res, next) => {
        try {
            const { limit, skip } = paginate(req)
            const chatRoomId = req.params.chatRoomId
            const userId = req.decodedToken.id

            const chatRoom = await this.chatRoomsRepo.getById(chatRoomId)
            if (!chatRoom) {
                return next(new AppError('Chat room not found', HTTP_STATUS_CODES.NOT_FOUND))
            }
            if (chatRoom.user1._id != userId && chatRoom.user2._id != userId) {
                return next(new AppError('Unauthorized access to chat room', HTTP_STATUS_CODES.FORBIDDEN))
            }

            await this.messagesRepo.markAsSeen(chatRoomId, userId)
            const messages = await this.messagesRepo.getAll(chatRoom, limit, skip)
            const { totalMessages, totalPages } = await this.messagesRepo.getPagesCount(chatRoomId, limit, skip)
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ messages, totalMessages, totalPages }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Deletes a message from the database.
     * @param {object} req - Express request object containing the message ID to delete.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response indicating successful deletion.
     * @throws {AppError} Throws an error if message is not found or user does not have permission to delete it.
     */
    delete = async (req, res, next) => {
        try {
            const messageId = req.params.messageId
            const userId = req.decodedToken.id

            const message = await this.messagesRepo.delete(messageId, userId)
            if (!message) {
                return next(
                    new AppError(
                        'Message not found or user does not have permission to delete it',
                        HTTP_STATUS_CODES.NOT_FOUND
                    )
                )
            }

            res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }
}

module.exports = MessagesController
