const verifySocketToken = require('./middlewares/verifySocketToken')
const AuctionModel = require('../models/auction.model')
const BidModel = require('../models/bid.model')
class Auction {
    constructor(io) {
        this.auction = io.of('/auction')
        this.auction.use(verifySocketToken)
        this.auction.on('connection', this.handleConnection)
    }

    handleConnection = async (socket) => {
        try {
            const auctionId = socket.handshake.query.auctionId
            const auction = await AuctionModel.findById(auctionId)
            if (!auction) {
                throw new Error('Auction not found')
            }
            socket.join(auctionId)
            socket.on('bid', this.handleBid)
            socket.on('disconnect', () => {
                socket.leave(auctionId)
            })
        } catch (err) {
            console.log(err)
            socket.disconnect()
        }
    }

    handleBid = async (data) => {
        const auctionId = data.auctionId
        const bid = new BidModel({
            auction: auctionId,
            buyer: data.buyerId,
            price: data.price,
        })
        await bid.save()
        this.auction.to(auctionId).emit('bid', bid)
    }
}
module.exports = Auction
