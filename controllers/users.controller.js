/**
 * Registers a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const register = asyncWrapper(async (req, res, next) => {
    /**
     * @type {string} firstName - The first name of the user.
     * @type {string} lastName - The last name of the user.
     * @type {string} email - The email of the user.
     * @type {string} phone - The phone number of the user.
     * @type {string} password - The password of the user.
     */
    const { firstName, lastName, email, phone, password } = req.body;
    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
        const error = appError.create('User already exists', 400, httpStatusText.FAIL);
        next(error);
    }

    const hashedPassword = hashPassword(password);

    const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser }, error: null });
});

/**
 * Logs in an existing user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const login = asyncWrapper(async (req, res, next) => {
    /**
     * @type {string} email - The email of the user.
     * @type {string} password - The password of the user.
     */
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        const error = appError.create('User not found', 400, httpStatusText.FAIL);
        return next(error);
        
    }

    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
        const error = appError.create('Invalid password', 401, httpStatusText.FAIL);
        return next(error);
    }

    const token = await generateJWT({ email: user.email, id: user._id });
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { token }, error: null });
});

module.exports = {
    register,
    login
};
