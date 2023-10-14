const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who placed the order (if applicable)
        required: true,
    },
    products: [
        {
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
        },
    ],
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order