const Message = require('../models/message.model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const appError = require('../utils/appError')
const ChatRoom = require('../models/chatRoom.model')

/**
 * Retrieves all messages for a specific chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllMessages = asyncWrapper(async (req, res, next) => {
    const limit = req.query.limit || 6
    const page = req.query.page || 1
    const skip = (page - 1) * limit
    const chatRoomId = req.params.chatRoomId
    const chatRoom = await ChatRoom.findById(chatRoomId)
    if (!chatRoom) {
        const error = appError.create(
            'ChatRoom not found',
            404,
            httpStatusText.FAIL
        )
        return next(error)
    }
    if (
        !(
            chatRoom.user1 == req.decodedToken.id ||
            chatRoom.user2 == req.decodedToken.id
        )
    ) {
        const error = appError.create(
            'User not authorized',
            401,
            httpStatusText.FAIL
        )
        return next(error)
    }
    const messages = await Message.find(
        { chatRoomId: chatRoomId },
        { __v: false }
    )
        .limit(limit)
        .skip(skip)
        .populate('senderId')

    res.json({
        status: httpStatusText.SUCCESS,
        data: { messages },
        error: null,
    })
})

/**
 * Creates a new message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createMessage = asyncWrapper(async (req, res, next) => {
    const chatRoom = await ChatRoom.findById(req.body.chatRoomId)
    if (!chatRoom) {
        const error = appError.create(
            'ChatRoom not found',
            404,
            httpStatusText.FAIL
        )
        return next(error)
    }
    const newMessage = new Message({
        chatRoomId: req.body.chatRoomId,
        content: req.body.content,
        senderId: req.decodedToken.id,
    })
    await newMessage.save()
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { newMessage },
        error: null,
    })
})

/**
 * Deletes a message by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteMessage = asyncWrapper(async (req, res, next) => {
    const messageId = req.params.messageId
    const message = await Message.findById(messageId)
    if (!message) {
        const error = appError.create(
            'Message not found',
            404,
            httpStatusText.FAIL
        )
        return next(error)
    }
    if (message.senderId != req.decodedToken.id) {
        const error = appError.create(
            'User not authorized',
            401,
            httpStatusText.FAIL
        )
        return next(error)
    }
    await Message.deleteOne({ _id: req.params.message_Id })
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null,
        error: null,
    })
})

module.exports = {
    getAllMessages,
    createMessage,
    deleteMessage,
}
