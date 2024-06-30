const mongoose = require('mongoose')

/**
 * Schema definition for the Message model.
 * @typedef {import('mongoose').Schema<Document<any, any, any>, import('mongoose').Model<Document<any, any, any>>, undefined, any>} MongooseSchema
 */

/**
 * @type {MongooseSchema}
 */
const messageSchema = new mongoose.Schema(
    {
        chatRoom: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'ChatRoom',
            validate: {
                /**
                 * Asynchronous validator function to check if the chat room exists.
                 * @param {mongoose.Schema.Types.ObjectId} value - The chat room's ObjectId.
                 * @returns {Promise<boolean>} Whether the chat room exists.
                 */
                validator: async function (value) {
                    const chatRoom = await mongoose.model('ChatRoom').findById(value)
                    return chatRoom !== null
                },
                message: 'Chat room does not exist',
            },
        },
        content: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
                /**
                 * Asynchronous validator function to check if the sender exists.
                 * @param {mongoose.Schema.Types.ObjectId} value - The sender's ObjectId.
                 * @returns {Promise<boolean>} Whether the sender exists.
                 */
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value)
                    return user !== null
                },
                message: 'Sender does not exist',
            },
        },
        seen: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Message', messageSchema)
