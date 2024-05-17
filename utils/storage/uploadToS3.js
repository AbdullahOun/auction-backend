const bufferToStream = require('./bufferToStream')
const S3 = require('./S3')
const { Upload } = require('@aws-sdk/lib-storage')
const process = require('process')
require('dotenv').config()

async function uploadToS3(file) {
    const stream = bufferToStream(file.buffer)
    const upload = new Upload({
        client: S3,
        params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}-${file.originalname}`,
            Body: stream,
        },
    })

    try {
        const data = await upload.done()
        return data.Location
    } catch (error) {
        console.error('Error uploading file to S3:', error)
        throw error
    }
}
module.exports = uploadToS3
