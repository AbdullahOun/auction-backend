class AppError {
    constructor(error, statusCode = 500) {
        this.error = error ?? 'Unkown error'
        this.statusCode = statusCode
        this.statusText = 'Error'
        this.data = null
    }
}

module.exports = AppError
