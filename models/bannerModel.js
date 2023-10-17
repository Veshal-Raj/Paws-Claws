const mongoose = require('mongoose')


const bannerSchema = new mongoose.Schema({
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    }
});

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner;