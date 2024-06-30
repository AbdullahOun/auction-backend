const { Readable } = require('node:stream')
const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const logger = require('../logging/logger')
const process = require('process')

require('dotenv').config()

class S3Util {
    constructor() {
        this.S3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        })
    }

    bufferToStream(buffer) {
        const stream = new Readable()
        stream.push(buffer)
        stream.push(null)
        return stream
    }

    async upload(file) {
        try {
            const stream = this.bufferToStream(file.buffer)
            const upload = new Upload({
                client: this.S3,
                params: {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `${Date.now()}-${file.originalname}`,
                    Body: stream,
                },
            })

            const data = await upload.done()
            return data.Location
        } catch (err) {
            logger.error(err.message)
            throw err
        }
    }

    async delete(paths) {
        try {
            const deletePromises = paths.map((path) => {
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: path,
                }
                return this.S3.send(new DeleteObjectCommand(params))
            })
            await Promise.all(deletePromises)
        } catch (err) {
            logger.error(err.message)
            throw err
        }
    }
}

module.exports = S3Util
