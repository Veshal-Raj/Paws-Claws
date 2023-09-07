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
    isVerified: {
        type: Boolean,
        default: false,
    },
})

// ==== Hash the user's password before saving it it the database ======= //
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified('password')){
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password,saltRounds)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User
