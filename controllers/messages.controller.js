const { validationResult } = require('express-validator');
const Message = require('../models/message.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');


/**
 * Retrieves all messages for a specific chat room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllMessages = asyncWrapper(
    async (req, res, next) => {
        const messages = await Message.find({ chatRoomId: req.params.chatRoom_Id }, { "__v": false });
        res.json({ status: httpStatusText.SUCCESS, data: { messages }, error: null });
    }
);

/**
 * Retrieves a message by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getMessage = asyncWrapper(
    async (req, res, next) => {
        const message = await Message.findOne({ _id: req.params.message_Id });
        if (!message) {
            const error = appError.create('Message not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({ status: httpStatusText.SUCCESS, data: { message }, error: null });
    }
);

/**
 * Creates a new message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const createMessage = asyncWrapper(
    async (req, res, next) => {
        const newMessage = new Message({
            chatRoomId: req.body.chatRoomId,
            content: req.body.content,
            senderId: req.decodedToken.id,
            createdAt: req.body.createdAt
        });
        await newMessage.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { newMessage }, error: null });
    }
);

/**
 * Updates a message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const updateMessage = asyncWrapper(
    async (req, res, next) => {
        await Message.updateOne({ _id: req.params.message_Id }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

/**
 * Deletes a message by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const deleteMessage = asyncWrapper(
    async (req, res, next) => {
        await Message.deleteOne({ _id: req.params.message_Id });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: null, error: null });
    }
);

module.exports = {
    getAllMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage
};
