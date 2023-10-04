const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who placed the order (if applicable)
        required:true, 
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products', // Reference to the product being ordered
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending','Processing','Shipped','Delivered','Cancelled'],
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
})

const Order = mongoose.model('Order',orderSchema)

module.exports = Order