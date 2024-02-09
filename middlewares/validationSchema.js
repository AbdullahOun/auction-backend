
const {body} = require("express-validator");
const validationSchema = ()=>{
    return [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('description').not().isEmpty().withMessage('Description is required'),
        body('initialPrice').not().isEmpty().withMessage('Min Price is required'),
        body('quantity').not().isEmpty().withMessage('quantity is required')
    ]
}

module.exports = {validationSchema};