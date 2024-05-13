const express = require('express')
const router = express.Router()
const {
    Register,
    Login,
    Update,
    Get,
} = require('../controllers/users.controller')
const verifyToken = require('../middlewares/verifyToken')

/**
 * Routes for user authentication and management.
 */

router
    .route('/')
    /**
     * PATCH request to update user information.
     * Requires authentication.
     */
    .patch(verifyToken, Update.isValid, Update.isUserExists, Update.update)
    /**
     * GET request to get user data.
     * Requires authentication.
     */
    .get(verifyToken, Get.one)

router
    .route('/register')
    /**
     * POST request to register a new user.
     */
    .post(Register.isValid, Register.isDuplicate, Register.register)

router
    .route('/login')
    /**
     * POST request to authenticate and log in a user.
     */
    .post(
        Login.isValid,
        Login.isUserExists,
        Login.isPasswordCorrect,
        Login.login
    )

module.exports = router
