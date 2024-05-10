const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')
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
    .patch(
        verifyToken,
        usersController.isUserIdExists,
        usersController.isValidUpdate,
        usersController.update
    )

router
    .route('/register')
    /**
     * POST request to register a new user.
     */
    .post(
        usersController.isValidRegister,
        usersController.isDuplicateUser,
        usersController.register
    )

router
    .route('/login')
    /**
     * POST request to authenticate and log in a user.
     */
    .post(
        usersController.isValidLogin,
        usersController.isUserEmailExists,
        usersController.isPasswordCorrect,
        usersController.login
    )

module.exports = router
