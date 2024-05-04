const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema(
    {
        chatRoomId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'ChatRoom',
        },
        content: {
            type: String,
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Message', messageSchema)
