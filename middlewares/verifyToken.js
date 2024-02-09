const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        const error = appError.create('token is required', 400, httpStatusText.FAIL);
        next(error);
    }
    
    const token = authHeader.split(' ')[1];
    try{
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        
        req.decodedToken = decodedToken;
        next();
    }catch(err){
    const error = appError.create('Invalid token', 401, httpStatusText.FAIL);
    next(error);
    }
};

module.exports = verifyToken;