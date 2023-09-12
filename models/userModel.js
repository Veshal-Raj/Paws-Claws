const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
        type: String,
        enum: ['Admin','Customer'],
        default:'Customer',
    },
    // blocking and unblocking user
    isVerified: {
        type: Boolean,
        default: true,
    },
})


 
const User = mongoose.model('User',userSchema)

module.exports = {User} 
