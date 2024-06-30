const AppError = require('../utils/appError')
const generateJWT = require('../utils/generateJWT')
const { hashPassword, verifyPassword } = require('../utils/encryption')
const AppResponse = require('../utils/appResponse')
const { HTTP_STATUS_CODES } = require('../utils/constants')
const registerSchema = require('../utils/validation/registerSchema')
const loginSchema = require('../utils/validation/loginSchema')
const userSchema = require('../utils/validation/userSchema')
const { logger } = require('../utils/logging/logger')
/**
 * Controller class for managing user-related operations.
 */
class UsersController {
    /**
     * Initializes the UsersController with a repository for user data operations.
     * @param {object} usersRepo - Repository for handling user data operations.
     */
    constructor(usersRepo) {
        this.usersRepo = usersRepo
    }

    /**
     * Registers a new user.
     * @param {object} req - Express request object containing user registration details.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing the created user.
     * @throws {AppError} Throws an error if user validation fails, user already exists, or an internal server error occurs.
     */
    register = async (req, res, next) => {
        try {
            let validatedBody

            try {
                validatedBody = await registerSchema.validateAsync({ ...req.body })
            } catch (err) {
                return next(new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST))
            }

            const { email, phone, password } = validatedBody

            if (await this.usersRepo.isExistsByContacts(email, phone)) {
                return next(new AppError('User already exists', HTTP_STATUS_CODES.BAD_REQUEST))
            }

            validatedBody.password = hashPassword(password)
            const user = await this.usersRepo.create(validatedBody)
            return res.status(HTTP_STATUS_CODES.CREATED).json(new AppResponse({ user }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Logs in a user with provided credentials.
     * @param {object} req - Express request object containing user login details.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing authentication token and user ID.
     * @throws {AppError} Throws an error if login validation fails, user does not exist, password is incorrect, or an internal server error occurs.
     */
    login = async (req, res, next) => {
        try {
            let validatedBody
            try {
                validatedBody = await loginSchema.validateAsync({ ...req.body })
            } catch (err) {
                return next(new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST))
            }

            const user = await this.usersRepo.getExistsByContacts(validatedBody.email)
            if (!user) {
                return next(new AppError('Invalid email or password', HTTP_STATUS_CODES.UNAUTHORIZED))
            }

            const { password } = validatedBody
            const isMatch = verifyPassword(password, user.password)
            if (!isMatch) {
                return next(new AppError('Invalid email or password', HTTP_STATUS_CODES.UNAUTHORIZED))
            }

            const token = await generateJWT({ email: user.email, id: user._id })
            return res.status(200).json(new AppResponse({ token, userId: user._id }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Retrieves user details based on the authenticated token.
     * @param {object} req - Express request object containing authenticated user details.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing user details.
     * @throws {AppError} Throws an error if user details retrieval fails or an internal server error occurs.
     */
    getByToken = async (req, res, next) => {
        try {
            const userId = req.decodedToken.id
            const user = await this.usersRepo.getById(userId)
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ user }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Retrieves user details by user ID.
     * @param {object} req - Express request object containing user ID.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing user details.
     * @throws {AppError} Throws an error if user is not found or an internal server error occurs.
     */
    getById = async (req, res, next) => {
        try {
            const userId = req.params.userId
            const user = await this.usersRepo.getById(userId)
            if (!user) {
                return next(new AppError('User not found', HTTP_STATUS_CODES.NOT_FOUND))
            }
            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ user }))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Updates user details.
     * @param {object} req - Express request object containing updated user details.
     * @param {object} res - Express response object.
     * @param {Function} next - Express next function.
     * @returns {Promise<void>} Resolves with a JSON response containing updated user details.
     * @throws {AppError} Throws an error if user validation fails, update conditions are not met, or an internal server error occurs.
     */
    update = async (req, res, next) => {
        try {
            let validatedBody
            try {
                validatedBody = await userSchema.validateAsync({ ...req.body })
            } catch (err) {
                return next(new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST))
            }

            const userId = req.decodedToken.id

            const user = await this.usersRepo.update(userId, validatedBody)
            if (!user) {
                return next(
                    new AppError(
                        'Email or phone must be different to update or do not specify them',
                        HTTP_STATUS_CODES.BAD_REQUEST
                    )
                )
            }

            return res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(user))
        } catch (err) {
            logger.error(err.message)
            return next(new AppError(err.message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }
}

module.exports = UsersController
