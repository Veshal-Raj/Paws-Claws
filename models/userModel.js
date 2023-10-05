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
        enum: ['Admin', 'Customer'],
        default: 'Customer',
    },
    // blocking and unblocking user
    isVerified: {
        type: Boolean,
        default: true,
    },
    address: [{
        fullname: { type: String },
        first_address: { type: String },
        country: { type: String },
        state: { type: String },
        city: { type: String },
        pincode: { type: Number },
        landmark: { type: String },
        mobileNumber: { type: Number }
    }],
    cart: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        product_name: { type: String },
        price: { type: String },
        quantity: {
            type: Number,
            default: 1,
        },
        totalPrice: { type: Number }
    }],
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }]
})



const User = mongoose.model('User', userSchema)

module.exports = { User } 
