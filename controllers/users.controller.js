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

/**
 * Register a new user middlwares hirerchy
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const isValidRegister = asyncWrapper(async (req, res, next) => {
    try {
        const result = await registerSchema.validateAsync({ ...req.body })
        req.body = result
        next()
    } catch (err) {
        next(
            new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST)
        )
    }
})

const isDuplicateUser = asyncWrapper(async (req, res, next) => {
    console.log('inIsDup')
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

const register = asyncWrapper(async (req, res, next) => {
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
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
    }

    res.status(HTTP_STATUS_CODES.CREATED).json(
        new AppResponse({ user: response })
    )
})

/**
 * Login a user middlwares hirerchy
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const isValidLogin = asyncWrapper(async (req, res, next) => {
    try {
        const result = await loginSchema.validateAsync({ ...req.body })
        req.body = result
        next()
    } catch (err) {
        next(
            new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST)
        )
    }
})

const isUserEmailExists = asyncWrapper(async (req, res, next) => {
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

const isPasswordCorrect = asyncWrapper(async (req, res, next) => {
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

const login = asyncWrapper(async (req, res, next) => {
    const user = req.user
    const token = await generateJWT({ email: user.email, id: user._id })
    res.status(200).json(new AppResponse({ token, userId: user._id }))
})

/**
 * Update an existing user hirerchy of middlewares.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const isUserIdExists = asyncWrapper(async (req, res, next) => {
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

const isValidUpdate = asyncWrapper(async (req, res, next) => {
    try {
        const result = await userSchema.validateAsync({ ...req.body })
        req.body = result
        next()
    } catch (err) {
        next(
            new AppError(err.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST)
        )
    }
})

const update = asyncWrapper(async (req, res, next) => {
    const decodedId = req.decodedToken.id
    const body = req.body
    await User.updateOne({ _id: decodedId }, { ...body })
    res.status(204).json(new AppResponse(null))
})

module.exports = {
    isValidRegister,
    isDuplicateUser,
    register,
    isValidLogin,
    isUserEmailExists,
    isPasswordCorrect,
    login,
    isUserIdExists,
    isValidUpdate,
    update,
}
