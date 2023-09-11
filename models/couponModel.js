const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code: {
        type: Sring,
        required: true,
    },
    description: String,
    discountType: {
        type: String,
        enum: ['Percentage','FixedAmount'],
        required: true,
    },
    discountValue: Number,
    minimumPurchase: Number,
    validForm: Date,
    validUntil: Date,
    isActive: {
        type: Boolean,
        default : true,
    },
})

const Coupon = mongoose.model('Coupon',couponSchema)

module.exports=Coupon
