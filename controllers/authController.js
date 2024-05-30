const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
}
exports.signuṕ = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        const token = signToken(newUser._id);
        res.status(201).json({
            status: 'sucess',
            token,
            data: {
                user: newUser,
            }
        })
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

        res.status(200).json({
            status: 'sucess',
            token
        });

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message,
          });
    }
    
}

