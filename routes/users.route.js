const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const UsersRepo = require('../repos/users.repo')
const UsersController = require('../controllers/users.controller')

const usersRepo = new UsersRepo()
const userController = new UsersController(usersRepo)

router.route('/').patch(verifyToken, userController.update).get(verifyToken, userController.getByToken)
router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/:userId').get(userController.getById)

module.exports = router
