const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    subcategoryName: {
        type: String,
        required : true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    isDisabled : {
        type: Boolean,
        default: false,
    }
})

const Subcategory = mongoose.model('Subcategory', subcategorySchema)

module.exports = Subcategory