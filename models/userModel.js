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
        mobileNumber: { type: String  }
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
    wishlist: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        product_name: { type: String },
        price: { type: String },
    }],
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    wallet: {
        balance: {
            type: Number,
            default: 0,
        },
        transactions: [
            {
                description: String,
                amount: Number,
            }
        ]
    }
})



const User = mongoose.model('User', userSchema)

module.exports = { User } 
