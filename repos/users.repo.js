const User = require('../models/user.model')

/**
 * Repository class for handling User operations.
 */
class UsersRepo {
    /**
     * Retrieves a user by their ID.
     * @param {string} userId - ID of the user to retrieve.
     * @returns {Promise<Object|null>} User object if found, null if not found.
     */
    async getById(userId) {
        const user = await User.findById(userId)
        return user
    }

    /**
     * Checks if a user exists by email or phone.
     * @param {string|null} email - Email of the user.
     * @param {string|null} phone - Phone number of the user.
     * @returns {Promise<Object|null>} User object if found, null if not found.
     */
    async getExistsByContacts(email = null, phone = null) {
        if (!email && !phone) {
            return false
        }
        const query = this._buildContactsQuery(email, phone)
        const user = await User.findOne(query)
        return user
    }

    /**
     * Checks if a user exists by email or phone.
     * @param {string|null} email - Email of the user.
     * @param {string|null} phone - Phone number of the user.
     * @returns {Promise<boolean>} True if user exists, false otherwise.
     */
    async isExistsByContacts(email = null, phone = null) {
        if (!email && !phone) {
            return false
        }
        const query = this._buildContactsQuery(email, phone)
        const user = await User.findOne(query)
        return user ? true : false
    }

    /**
     * Creates a new user.
     * @param {Object} body - User data to create.
     * @returns {Promise<Object>} Created user object without password field.
     */
    async create(body) {
        const user = new User({
            ...body,
            address: {
                country: '',
                city: '',
                street: '',
                houseNumber: '',
            },
        })

        await user.save()
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = user.toObject()
        return userWithoutPassword
    }

    /**
     * Updates a user by their ID.
     * @param {string} userId - ID of the user to update.
     * @param {Object} body - Updated user data.
     * @returns {Promise<Object|null>} Updated user object if successful, null if user does not exist or update fails.
     */
    async update(userId, body) {
        if (await this.isExistsByContacts(body.email, body.phone)) {
            return null
        }
        const user = await User.findOneAndUpdate({ _id: userId }, { ...body }, { new: true })
        return user
    }

    /**
     * Builds a query object based on email and phone.
     * @param {string|null} email - Email of the user.
     * @param {string|null} phone - Phone number of the user.
     * @returns {Object|null} Query object to find user by email or phone, or null if both are not provided.
     * @private
     */
    _buildContactsQuery(email, phone) {
        if (!email && !phone) {
            return null
        }
        const query = { $or: [] }
        if (email) query.$or.push({ email })
        if (phone) query.$or.push({ phone })
        return query
    }
}

module.exports = UsersRepo
