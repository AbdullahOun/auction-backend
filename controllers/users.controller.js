const User = require('../models/user.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');

const register = asyncWrapper( async (req,res,next)=>{
    const {firstName, lastName, email, phone, password} = req.body;
    const oldUser = await User.findOne({ email: email});
    if(oldUser){
        const error = appError.create('User already exists', 400, httpStatusText.FAIL);
        next(error);
    }

    const hashedPassword = await bcrypt.hash((password),10);

    const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword
    });
    const token = await generateJWT({ email: newUser.email, id: newUser._id});
//   await jwt.sign({ email: newUser.email, id: newUser._id},process.env.JWT_SECRET_KEY,{expiresIn: '1m'})
    newUser.token = token;
    
    await newUser.save();
    res.status(201).json({status: httpStatusText.SUCCESS,data: {user: newUser}})
})

const login = asyncWrapper( async (req,res,next)=>{
    const {email, password} = req.body;
    const user = await User.findOne({ email: email});
    if(!user){
        const error = appError.create('User not found', 400, httpStatusText.FAIL);
        next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        const error = appError.create('Invalid password', 400, httpStatusText.FAIL);
        next(error);
    }
    // aloooooooooooooooooo
    const token = await generateJWT({ email: user.email, id: user._id});

    res.status(200).json({status: httpStatusText.SUCCESS,data: {token}})
    
})


module.exports = {
    register,
    login
};