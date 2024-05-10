/**
 * Represents a response from the application.
 */
class AppResponse {
    /**
     * Create an instance of AppResponse.
     * @param {any} data - The data to be included in the response.
     */
    constructor(data) {
        /**
         * Error information. If null, the request was successful.
         * @type {Object | null}
         */
        this.error = null

        /**
         * The status text of the response.
         * @type {string}
         */
        this.statusText = 'Success'

        /**
         * The data included in the response.
         * @type {any}
         */
        this.data = data
    }
}

module.exports = AppResponse
