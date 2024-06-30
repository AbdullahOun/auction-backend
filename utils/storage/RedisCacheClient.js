const { createClient } = require('redis')
const { logger } = require('../logging/logger')
const process = require('process')

require('dotenv').config()

class RedisCacheClient {
    static client = null

    constructor() {
        throw new Error('Use RedisCacheClient.getClient() to get the Redis client instance.')
    }

    static async getClient() {
        if (!RedisCacheClient.client) {
            try {
                const redisHost = process.env.REDIS_HOST
                const redisPort = process.env.REDIS_PORT
                const redisPassword = process.env.REDIS_PASSWORD

                if (!redisHost || !redisPort || !redisPassword) {
                    throw new Error('Missing Redis configuration in environment variables.')
                }

                RedisCacheClient.client = createClient({
                    password: redisPassword,
                    socket: {
                        host: redisHost,
                        port: redisPort,
                    },
                })

                RedisCacheClient.client.on('error', (err) => logger.error('Redis Client Error:', err))
                await RedisCacheClient.client.connect()

                process.on('SIGINT', async () => {
                    await RedisCacheClient.client.disconnect()
                    logger.info('Redis client disconnected gracefully.')
                    process.exit(0)
                })
            } catch (err) {
                logger.error('Redis connection error:', err.message)
                throw new Error('Redis connection error')
            }
        }
        return RedisCacheClient.client
    }

    static async set(key, value, expiryInSeconds = 300) {
        try {
            const client = await RedisCacheClient.getClient()
            const serializedValue = JSON.stringify(value)

            await client.set(key, serializedValue, {
                EX: expiryInSeconds,
            })

            logger.info(`Redis SET success: key=${key}`)
        } catch (err) {
            logger.error(`Redis SET error for key=${key}:`, err.message)
            throw err
        }
    }

    static async get(key) {
        try {
            const client = await RedisCacheClient.getClient()
            const serializedValue = await client.get(key)

            if (serializedValue === null) {
                logger.warn(`Redis GET: key=${key} not found`)
                return null
            }

            let value
            try {
                value = JSON.parse(serializedValue)
            } catch (err) {
                logger.error(`Redis GET error parsing JSON for key=${key}:`, err.message)
                value = serializedValue
            }

            logger.info(`Redis GET success: key=${key}`)
            return value
        } catch (err) {
            logger.error(`Redis GET error for key=${key}:`, err.message)
            throw err
        }
    }
}

module.exports = RedisCacheClient
