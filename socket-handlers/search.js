const { logger } = require('../utils/logging/logger')
const AuctionRepo = require('../repos/auction.repo')

const auctionRepo = new AuctionRepo()

class Search {
    constructor(io) {
        this.search = io.of('/search')
        this.search.on('connection', this.handleConnection)
    }

    handleConnection = (socket) => {
        try {
            socket.on('search-query', (data) => this.handleSearchQuery(socket, data))
        } catch (error) {
            logger.error('Connection Error:', error.message)
            socket.disconnect()
        }
    }
    handleSearchQuery = async (socket, data) => {
        try {
            const query = data.query
            console.log(query)
            const auctions = await auctionRepo.searchByName(query, 50, 0)
            socket.emit('search-result', auctions)
        } catch (error) {
            logger.error('Search Query Error:', error.message)
        }
    }
}

module.exports = Search
