const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')
const verifyToken = require('../middlewares/verifyToken')

router.route('/register').post(usersController.register)

router.route('/login').post(usersController.login)

router.route('/').patch(verifyToken, usersController.updateUser)

module.exports = router
