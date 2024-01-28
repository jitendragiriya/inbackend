const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    lastActivity: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
