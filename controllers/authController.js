const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signuṕ = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '90d'
        });

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

