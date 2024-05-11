const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const { Server } = require('socket.io')
require('dotenv').config()

// Import routers
const productsRouter = require('./routes/products.route')
const usersRouter = require('./routes/users.route')
const auctionsRouter = require('./routes/auctions.route')
const messagesRouter = require('./routes/messages.route')
const chatRoomsRouter = require('./routes/chatRooms.route')
const bidsRouter = require('./routes/bids.route')
const imagesRouter = require('./routes/images.route')
const Chat = require('./socket-handlers/chat')

const http = require('http')
const app = express()
const port = process.env.PORT || 4000
const url = process.env.MONGO_URL
const httpServer = http.createServer(app) // Create HTTP server
const io = new Server(httpServer) // Create Socket.IO server

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(cors())
app.use(express.json())

// Import custom utilities and constants
const AppError = require('./utils/appError')
const { HTTP_STATUS_CODES } = require('./utils/constants')
const Auction = require('./socket-handlers/auction')

// Route definitions
app.use('/api/users', usersRouter)
app.use('/api/auctions', auctionsRouter)
app.use('/api/products', productsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/chat-rooms', chatRoomsRouter)
app.use('/api/bids', bidsRouter)
app.use('/api/images', imagesRouter)

/**
 * Catch-all route handler for routes not found.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
app.all('*', (req, res, next) => {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json(
        new AppError('Resource not found', HTTP_STATUS_CODES.NOT_FOUND)
    )
})

/**
 * Global error handler middleware.
 * @param {Error} error - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
app.use((error, req, res, next) => {
    res.status(
        error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    ).json(error || new AppError())
})

// Connect to MongoDB and start the server
mongoose.connect(url).then(() => {
    console.log('MongoDB server started')
    httpServer.listen(port, () => console.log(`Server running at ${port}!`))
})

new Chat(io)
new Auction(io)
