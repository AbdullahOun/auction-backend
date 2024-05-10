const ChatRoom = require('../models/chatRoom.model')
const User = require('../models/user.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppResponse = require('../utils/appResponse')
const AppError = require('../utils/appError')
const paginate = require('../utils/paginate')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')
const Message = require('../models/message.model')
const mongoose = require('mongoose')

/**
 * Get all chat rooms where the current user is involved.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAllChatRooms = asyncWrapper(async (req, res, next) => {
    const { limit, skip } = paginate(req)
    const decodedId = req.decodedToken.id

    const chatRooms = await ChatRoom.find({
        $or: [{ user1: decodedId }, { user2: decodedId }],
    })
        .select('-__v')
        .populate('user2')
        .populate('user1')
        .limit(limit)
        .skip(skip)

    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ chatRooms }))
})

/**
 * Get details of a specific chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getChatRoom = asyncWrapper(async (req, res, next) => {
    const decodedId = req.decodedToken.id
    const chatRoomId = req.params.chatRoomId

    const chatRoom = await ChatRoom.findById(chatRoomId)
        .select('-__v')
        .populate('user1')
        .populate('user2')

    if (!chatRoom) {
        return next(
            new AppError(
                MODEL_MESSAGES.chatRoom.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    if (!(chatRoom.user1._id == decodedId || chatRoom.user2._id == decodedId)) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.unauthorized,
                HTTP_STATUS_CODES.FORBIDDEN
            )
        )
    }

    res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ chatRoom }))
})

/**
 * Create a new chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const createChatRoom = asyncWrapper(async (req, res, next) => {
    const user2Id = req.body.user2Id
    const user1Id = req.decodedToken.id

    const user2 = await User.findById(user2Id)

    if (!user2 || user2Id == user1Id) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    const newChatRoom = new ChatRoom({
        user1: user1Id,
        user2: user2Id,
    })

    await newChatRoom.save()

    res.status(HTTP_STATUS_CODES.CREATED).json(
        new AppResponse({ chatRoom: newChatRoom })
    )
})

/**
 * Delete a specific chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const deleteChatRoom = asyncWrapper(async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const chatRoomId = req.params.chatRoomId
        const decodedId = req.decodedToken.id

        const chatRoom = await ChatRoom.findById(chatRoomId).session(session)

        if (!chatRoom) {
            return next(
                new AppError(
                    MODEL_MESSAGES.chatRoom.notFound,
                    HTTP_STATUS_CODES.NOT_FOUND
                )
            )
        }

        if (!(chatRoom.user1 == decodedId || chatRoom.user2 == decodedId)) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.unauthorized,
                    HTTP_STATUS_CODES.FORBIDDEN
                )
            )
        }
        await Message.deleteMany({ chatRoom: chatRoomId }).session(session)
        await ChatRoom.deleteOne({ _id: chatRoomId }).session(session)
        await session.commitTransaction()
        session.endSession()
        return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
    } catch (error) {
        console.log(error)
        await session.abortTransaction()
        session.endSession()
        return next(
            new AppError(
                'Failed To Delete Chatroom',
                HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            )
        )
    }
})

module.exports = {
    getAllChatRooms,
    getChatRoom,
    createChatRoom,
    deleteChatRoom,
}
