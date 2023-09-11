const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDescription: String,
    price: Number,
    cost: Number,
    quantityInStock: Number,
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
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product