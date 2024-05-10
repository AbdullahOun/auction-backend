/**
 * Represents an application error.
 */
class AppError {
    /**
     * Create an instance of AppError.
     * @param {string} error - The error message.
     * @param {number} [statusCode=400] - The status code of the error.
     */
    constructor(error, statusCode = 500) {
        /**
         * The error message.
         * @type {string}
         */
        this.error = error

        /**
         * The status code of the error.
         * @type {number}
         */
        this.statusCode = statusCode

        /**
         * The status text.
         * @type {string}
         */
        this.statusText = 'Error'

        /**
         * Additional data associated with the error.
         * @type {any}
         */
        this.data = null
    }
}

module.exports = AppError
