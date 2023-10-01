const User = require('../models/userModel')

const showOrders = async (req,res) => {
    try {
        const userId = req.session.userId
        res.render('users/orders',{userId})
    } catch (error) {
        
    }
}

module.exports = {
    showOrders
}