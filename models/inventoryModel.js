const mongoose = require('mongoose')

const inventoryTransactionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    transcationType: String,
    transcationDate: Date,
    quantityChange: Number,
    newStockQuantity: Number,
    notes: String,
})

const inventoryTransaction = mongoose.model('inventoryTransaction', inventoryTransactionSchema)

module.exports = inventoryTransaction