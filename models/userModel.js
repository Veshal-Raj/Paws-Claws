const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Boolean,
        default: 0,
    },
    // blocking and unblocking user
    isVerified: {
        type: Boolean,
        default: false,
    },
})


 
const User = mongoose.model('User',userSchema)

module.exports = User
