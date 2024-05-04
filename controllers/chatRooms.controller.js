const ChatRoom = require('../models/chatRoom.model')
const User = require('../models/user.model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const appError = require('../utils/appError')

/**
 * Retrieves all chat rooms for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllChatRooms = asyncWrapper(async (req, res, next) => {
    const limit = req.query.limit || 6
    const page = req.query.page || 1
    const skip = (page - 1) * limit
    const userId = req.decodedToken.id
    const chatRooms = await ChatRoom.find(
        { $or: [{ user1: userId }, { user2: userId }] },
        { __v: false }
    )
        .populate('user2')
        .populate('user1')
        .limit(limit)
        .skip(skip)
    res.json({
        status: httpStatusText.SUCCESS,
        data: { chatRooms },
        error: null,
    })
})

/**
 * Retrieves a chat room by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getChatRoom = asyncWrapper(async (req, res, next) => {
    const chatRoom = await ChatRoom.findById(req.params.chatRoomId)
        .populate('user1')
        .populate('user2')

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
            chatRoom.user1._id == req.decodedToken.id ||
            chatRoom.user2._id == req.decodedToken.id
        )
    ) {
        const error = appError.create(
            'User not authorized',
            401,
            httpStatusText.FAIL
        )
        return next(error)
    }
    res.json({
        status: httpStatusText.SUCCESS,
        data: { chatRoom },
        error: null,
    })
})

/**
 * Creates a new chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createChatRoom = asyncWrapper(async (req, res, next) => {
    const user2Id = req.body.user2Id
    const user1Id = req.decodedToken.id
    const user2 = await User.findById(user2Id)
    if (!user2 || user2Id == user1Id) {
        const error = appError.create(
            'User2 not found',
            404,
            httpStatusText.FAIL
        )
        return next(error)
    }
    const newChatRoom = new ChatRoom({
        user1: user1Id,
        user2: user2Id,
    })
    await newChatRoom.save()
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { newChatRoom },
        error: null,
    })
})

/**
 * Deletes a chat room by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteChatRoom = asyncWrapper(async (req, res, next) => {
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
            chatRoom.user1._id == req.decodedToken.id ||
            chatRoom.user2._id == req.decodedToken.id
        )
    ) {
        const error = appError.create(
            'User not authorized',
            401,
            httpStatusText.FAIL
        )
        return next(error)
    }
    await ChatRoom.deleteOne({ _id: chatRoomId })
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null,
        error: null,
    })
})

module.exports = {
    getAllChatRooms,
    getChatRoom,
    createChatRoom,
    deleteChatRoom,
}
