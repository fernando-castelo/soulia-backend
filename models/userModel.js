const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;