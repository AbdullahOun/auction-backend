const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const S3 = require('./S3')
const process = require('process')
require('dotenv').config()

const deleteFromS3 = async (paths) => {
    const deletePromises = paths.map((path) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path,
        }
        return S3.send(new DeleteObjectCommand(params))
    })
    await Promise.all(deletePromises)
}

module.exports = deleteFromS3
