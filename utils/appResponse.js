class AppResponse {
    constructor(data) {
        this.error = null
        this.statusText = 'Success'
        this.data = data
    }
}

module.exports = AppResponse
