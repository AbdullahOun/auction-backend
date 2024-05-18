const mongoose = require('mongoose')

/**
 * Schema for the Message model.
 */
const messageSchema = new mongoose.Schema(
    {
        /**
         * The chat room associated with the message.
         * @type {mongoose.Schema.Types.ObjectId}
         * @required
         * @ref ChatRoom
         * @validate Custom validator to check if chatRoom exists in the ChatRoom collection
         */
        chatRoom: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'ChatRoom',
            validate: {
                validator: async function (value) {
                    const chatRoom = await mongoose
                        .model('ChatRoom')
                        .findById(value)
                    return chatRoom !== null
                },
                message: 'Chat room does not exist',
            },
        },
        /**
         * The content of the message.
         * @type {String}
         * @required
         */
        content: {
            type: String,
            required: true,
        },
        /**
         * The sender of the message.
         * @type {mongoose.Schema.Types.ObjectId}
         * @required
         * @ref User
         * @validate Custom validator to check if sender exists in the User collection
         */
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
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
        /**
         * Adds createdAt and updatedAt fields to the schema.
         */
        timestamps: true,
    }
)

messageSchema.post('save', async function (doc, next) {
    await doc
        .populate('chatRoom')
        .populate({
            path: 'sender',
            select: '-password',
        })
        .execPopulate()
    next()
})

module.exports = mongoose.model('Message', messageSchema)
