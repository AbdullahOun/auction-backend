const User = require('../models/user.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const generateJWT = require('../utils/generateJWT')
const { hashPassword, verifyPassword } = require('../utils/encryption')
const AppResponse = require('../utils/appResponse')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')
const registerSchema = require('../utils/validation/registerSchema')
const loginSchema = require('../utils/validation/loginSchema')
const userSchema = require('../utils/validation/userSchema')

class Register {
    /**
     * @description Validate register request body.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course register
     * @order 1
     */
    static isValid = asyncWrapper(async (req, res, next) => {
        try {
            const result = await registerSchema.validateAsync({ ...req.body })
            req.body = result
            next()
        } catch (err) {
            next(
                new AppError(
                    err.details[0].message,
                    HTTP_STATUS_CODES.BAD_REQUEST
                )
            )
        }
    })

    /**
     * @description  Check if user is registered before.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course register
     * @order 2
     */
    static isDuplicate = asyncWrapper(async (req, res, next) => {
        const { email, phone } = req.body
        const user = await User.findOne({
            $or: [{ email: email }, { phone: phone }],
        })

        if (user) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.alreadyExists,
                    HTTP_STATUS_CODES.BAD_REQUEST
                )
            )
        }
        return next()
    })

    /**
     * @description  Register user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course register
     * @order 3
     */
    static register = asyncWrapper(async (req, res, next) => {
        const { firstName, lastName, email, phone, password } = req.body
        const hashedPassword = hashPassword(password)

        // Create a new user instance
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            address: {
                country: '',
                city: '',
                street: '',
                houseNumber: '',
            },
        })
        await user.save()

        const response = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
        }

        res.status(HTTP_STATUS_CODES.CREATED).json(
            new AppResponse({ user: response })
        )
    })
}

class Login {
    /**
     * @description  Validate login request body.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course login
     * @order 1
     */
    static isValid = asyncWrapper(async (req, res, next) => {
        try {
            const result = await loginSchema.validateAsync({ ...req.body })
            req.body = result
            next()
        } catch (err) {
            next(
                new AppError(
                    err.details[0].message,
                    HTTP_STATUS_CODES.BAD_REQUEST
                )
            )
        }
    })

    /**
     * @description  Check user existance.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course register
     * @order 2
     */
    static isUserExists = asyncWrapper(async (req, res, next) => {
        const { email } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.notFound,
                    HTTP_STATUS_CODES.NOT_FOUND
                )
            )
        }
        req.user = user
        next()
    })

    /**
     * @description  Verify user password.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course login
     * @order 3
     */
    static isPasswordCorrect = asyncWrapper(async (req, res, next) => {
        const { password } = req.body
        const user = req.user
        const isMatch = verifyPassword(password, user.password)
        if (!isMatch) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.invalidPassword,
                    HTTP_STATUS_CODES.UNAUTHORIZED
                )
            )
        }
        next()
    })

    /**
     * @description  Login the user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course login
     * @order 4
     */
    static login = asyncWrapper(async (req, res, next) => {
        const user = req.user
        const token = await generateJWT({ email: user.email, id: user._id })
        res.status(200).json(new AppResponse({ token, userId: user._id }))
    })
}

class Update {
    /**
     * @description  Validate update request body.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update user
     * @order 1
     */
    static isValid = asyncWrapper(async (req, res, next) => {
        try {
            const result = await userSchema.validateAsync({ ...req.body })
            req.body = result
            next()
        } catch (err) {
            next(
                new AppError(
                    err.details[0].message,
                    HTTP_STATUS_CODES.BAD_REQUEST
                )
            )
        }
    })
    /**
     * @description  Check user existance by incomming edcoded id.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update user
     * @order 2
     */
    static isUserExists = asyncWrapper(async (req, res, next) => {
        const decodedId = req.decodedToken.id

        const user = await User.findById(decodedId)
        if (!user) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.notFound,
                    HTTP_STATUS_CODES.NOT_FOUND
                )
            )
        }
        next()
    })

    /**
     * @description  Update the user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @course update user
     * @order 3
     */
    static update = asyncWrapper(async (req, res, next) => {
        const decodedId = req.decodedToken.id
        const body = req.body
        await User.updateOne({ _id: decodedId }, { ...body })
        res.status(204).json(new AppResponse(null))
    })
}

module.exports = {
    Register,
    Login,
    Update,
}
