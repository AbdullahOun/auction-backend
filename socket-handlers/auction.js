const verifySocketToken = require('./middlewares/verifySocketToken')
const { logger } = require('../utils/logging/logger')
const AuctionRepo = require('../repos/auction.repo')
const BidsRepo = require('../repos/bids.repo')

const auctionRepo = new AuctionRepo()
const bidsRepo = new BidsRepo()

class Auction {
    constructor(io) {
        this.auction = io.of('/auction')
        this.auction.use(verifySocketToken)
        this.auction.on('connection', this.handleConnection)
    }

    handleConnection = async (socket) => {
        try {
            const auctionId = socket.handshake.query.auctionId
            const auction = await auctionRepo.getById(auctionId)
            if (!auction) {
                throw new Error('Auction not found')
            }
            socket.join(auctionId)
            socket.on('bid', this.handleBid)
            socket.on('disconnect', () => {
                socket.leave(auctionId)
            })
        } catch (error) {
            logger.error(error.message)
            socket.disconnect()
        }
    }

    handleBid = async (data) => {
        try {
            const auctionId = data.auctionId
            const bid = await bidsRepo.createAndRetireve(auctionId, data.buyerId, data.price)
            this.auction.to(auctionId).emit('bid', bid)
        } catch (error) {
            logger.error(error.message)
        }
    }
}
module.exports = Auction
