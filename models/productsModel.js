const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        // required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0, // Set a default value
    },
    cost: {
        type: Number,
        required: true,
        default: 0, // Set a default value
    },
    quantityInStock: {
        type: Number,
        required: true,
        default: 0, // Set a default value
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
    },
    productImages: [String], // Array of URLs or file references
    weight: String,
    lastupdated: {
        type: Date,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    }
},
    { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product