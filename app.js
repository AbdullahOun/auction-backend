const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const httpStatusText = require('./utils/httpStatusText')
const port = process.env.PORT || 4000
const mongoose = require('mongoose')
const path = require('path')
const url = process.env.MONGO_URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(cors())
app.use(express.json())
const productsRouter = require('./routes/products.route')
const usersRouter = require('./routes/users.route')
const auctionsRouter = require('./routes/auctions.route')
const messagesRouter = require('./routes/messages.route')
const chatRoomsRouter = require('./routes/chatRooms.route')
const bidsRouter = require('./routes/bids.route')
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auctions', auctionsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/chat-rooms', chatRoomsRouter)
app.use('/api/bids', bidsRouter)
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: httpStatusText.ERROR,
        message: 'This resource is not available',
    })
})

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        error: error.message,
        data: null,
    })
})
mongoose.connect(url).then(() => {
    console.log('mongodb server started')
    app.listen(port, () => console.log(`Server running at ${port}!`))
})
