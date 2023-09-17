const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },
    subcategories: [
        {

        type: ObjectId,
        ref: 'Subcategory'
    }
    ],
    isDisabled : {
        type: Boolean,
        default: false,
    }
})

const Category = mongoose.model('Category',categorySchema)

module.exports = {Category};