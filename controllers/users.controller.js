const User = require('../models/user.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const generateJWT = require('../utils/generateJWT')
const { hashPassword, verifyPassword } = require('../utils/encryption')
const AppResponse = require('../utils/appResponse')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')

/**
 * Register a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, phone, password } = req.body

    const oldUser = await User.findOne({
        $or: [{ email: email }, { phone: phone }],
    })

    if (oldUser) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.alreadyExists,
                HTTP_STATUS_CODES.BAD_REQUEST
            )
        )
    }

    // Hash the password before saving it to the database
    const hashedPassword = hashPassword(password)

    // Create a new user instance
    const newUser = new User({
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

    // Save the new user to the database
    await newUser.save()

    res.status(HTTP_STATUS_CODES.CREATED).json(
        new AppResponse({ user: newUser })
    )
})

/**
 * Login a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email: email })

    if (!user) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    // Verify the password
    const isMatch = verifyPassword(password, user.password)
    if (!isMatch) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.invalidPassword,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        )
    }

    // Generate JWT token for the user
    const token = await generateJWT({ email: user.email, id: user._id })

    res.status(200).json(new AppResponse({ token }))
})

/**
 * Update an existing user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateUser = asyncWrapper(async (req, res, next) => {
    const decodedId = req.decodedToken.id

    // Find the user by ID
    const user = await User.findById(decodedId)
    if (!user) {
        return next(
            new AppError(
                MODEL_MESSAGES.user.notFound,
                HTTP_STATUS_CODES.NOT_FOUND
            )
        )
    }

    // Update the user with the request body
    const body = req.body
    await User.updateOne({ _id: decodedId }, { ...body })

    res.status(204).json(new AppResponse(null))
})

module.exports = {
    register,
    login,
    updateUser,
}
