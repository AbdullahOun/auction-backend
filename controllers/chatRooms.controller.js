const AppResponse = require('../utils/appResponse')
const AppError = require('../utils/appError')
const paginate = require('../utils/paginate')
const { HTTP_STATUS_CODES } = require('../utils/constants')
const mongoose = require('mongoose')
const { logger } = require('../utils/logging/logger')

/**
 * Controller class for handling chat room operations.
 */
class ChatRoomsController {
    /**
     * Initializes the ChatRoomsController with repositories for chat rooms, messages, and users.
     * @param {object} chatRoomsRepo - Repository handling chat room data.
     * @param {object} messagesRepo - Repository handling message data.
     * @param {object} usersRepo - Repository handling user data.
     */
    constructor(chatRoomsRepo, messagesRepo, usersRepo) {
        this.chatRoomsRepo = chatRoomsRepo
        this.messagesRepo = messagesRepo
        this.usersRepo = usersRepo
    }

    /**
     * Get all chat rooms for the authenticated user.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing chat rooms.
     * @throws {AppError} Throws an error if retrieval fails.
     */
    getAll = async (req, res, next) => {
        try {
            const { limit, skip } = paginate(req)
            const userId = req.decodedToken.id
            const chatRooms = await this.chatRoomsRepo.getAll(userId, limit, skip)
            await Promise.all(
                chatRooms.map(async (chatRoom) => {
                    chatRoom.unseenCount = await this.messagesRepo.getUnseenCount(chatRoom._id, userId)
                })
            )
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ chatRooms }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Get a chat room by its ID for the authenticated user.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the chat room.
     * @throws {AppError} Throws an error if chat room is not found or user is unauthorized.
     */
    getById = async (req, res, next) => {
        try {
            const userId = req.decodedToken.id
            const chatRoomId = req.params.chatRoomId
            const chatRoom = await this.chatRoomsRepo.getById(chatRoomId)

            if (!chatRoom) {
                return next(new AppError('Chat room not found', HTTP_STATUS_CODES.NOT_FOUND))
            }

            if (chatRoom.user1._id != userId && chatRoom.user2._id != userId) {
                return next(new AppError('Unauthorized access to chat room', HTTP_STATUS_CODES.FORBIDDEN))
            }

            chatRoom.unseenCount = await this.messagesRepo.getUnseenCount(chatRoom._id, userId)

            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ chatRoom }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Create a new chat room between the authenticated user and another user.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the created chat room.
     * @throws {AppError} Throws an error if user does not exist, chat room already exists, or creation fails.
     */

    create = async (req, res, next) => {
        try {
            const user2Id = req.body.user2Id
            const user1Id = req.decodedToken.id

            const user2 = await this.usersRepo.getById(user2Id)

            if (!user2 || user2Id == user1Id) {
                return next(new AppError('User not found', HTTP_STATUS_CODES.NOT_FOUND))
            }

            if (await this.chatRoomsRepo.isExistsByUserRefs(user1Id, user2Id)) {
                return next(new AppError('Chat room with same users already exists', HTTP_STATUS_CODES.CONFLICT))
            }

            const chatRoom = await this.chatRoomsRepo.create(user1Id, user2Id)

            return res.status(HTTP_STATUS_CODES.CREATED).json(new AppResponse({ chatRoom }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Delete a chat room by its ID for the authenticated user.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the deleted chat room.
     * @throws {AppError} Throws an error if deletion fails or user is unauthorized.
     */
    delete = async (req, res, next) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const chatRoomId = req.params.chatRoomId
            const userId = req.decodedToken.id

            const chatRoom = await this.chatRoomsRepo.getByIdTransaction(chatRoomId, session)

            if (!chatRoom) {
                return next(new AppError('Chat room not found', HTTP_STATUS_CODES.NOT_FOUND))
            }

            if (chatRoom.user1 != userId && chatRoom.user2 != userId) {
                return next(new AppError('Unauthorized access to chat room', HTTP_STATUS_CODES.FORBIDDEN))
            }
            await this.messagesRepo.deleteAllByRoomIdTransaction(chatRoomId, session)
            const deletedRoom = await this.chatRoomsRepo.deleteTransaction(chatRoomId, session)
            await session.commitTransaction()
            session.endSession()

            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ chatRoom: deletedRoom }))
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            logger.error(err.message)
            return next(new AppError('Failed To Delete Chatroom', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }
}

module.exports = ChatRoomsController
