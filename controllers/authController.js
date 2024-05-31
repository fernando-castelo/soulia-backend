const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    
    res.cookie('jwt', token, cookieOptions) 

    user.password = undefined;

    res.status(statusCode).json({
        status: 'sucess',
        token,
        data: {
            user
        }
    });
}   

exports.signuṕ = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(400).json({
          status: 'failed',
          message: err.message,
        });
      }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            throw new Error('Please provide email and password!');
        }

        const user = await User.findOne({ email });

        if(!user || !(await user.correctPassword(password, user.password))) {
            throw new Error('Incorrect email or password!');
        }
    
        const token = signToken(user._id);

        createSendToken(user, 200, res);

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message,
          });
    }
    
}

exports.protect = async(req, res, next) => {

    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
        }
    
        if(!token) {
            throw new Error('You are not logged in!');
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);

        req.user = currentUser; 
        next();
    } catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err.message,
        })
    }
   
}
