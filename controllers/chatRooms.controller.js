const ChatRoom = require('../models/chatRoom.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

/**
 * Retrieves all chat rooms for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllChatRooms = asyncWrapper(
    async (req, res, next) => {
        const chatRooms = await ChatRoom.find({ user1: req.decodedToken.id }, { "__v": false });
        res.json({ status: httpStatusText.SUCCESS, data: { chatRooms }, error: null });
    }
);

/**
 * Retrieves a chat room by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getChatRoom = asyncWrapper(
    async (req, res, next) => {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomid);
        if (!chatRoom) {
            const error = appError.create('ChatRoom not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { chatRoom }, error: null });
    }
);

/**
 * Creates a new chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createChatRoom = asyncWrapper(
    async (req, res, next) => {
        const newChatRoom = new ChatRoom({ user1: req.decodedToken.id, user2: req.body.user2Id });
        await newChatRoom.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newChatRoom }, error: null });
    }
);

/**
 * Updates a chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateChatRoom = asyncWrapper(
    async (req, res, next) => {
        const chatRoomid = req.params.chatRoomid;
        await ChatRoom.updateOne({ _id: chatRoomid }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

/**
 * Deletes a chat room by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteChatRoom = asyncWrapper(
    async (req, res, next) => {
        const chatRoomid = req.params.chatRoomid;
        await ChatRoom.deleteOne({ _id: chatRoomid });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getAllChatRooms,
    getChatRoom,
    createChatRoom,
    updateChatRoom,
    deleteChatRoom
};
