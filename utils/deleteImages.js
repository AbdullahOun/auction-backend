const path = require('path')
const { existsSync } = require('fs')
const { unlink } = require('fs').promises

const deleteImages = async (imagesPaths) => {
    for (const image of imagesPaths) {
        const imagePath = path.join(__dirname, '..', 'uploads', image)
        if (existsSync(imagePath)) {
            await unlink(imagePath)
        }
    }
}

module.exports = deleteImages
