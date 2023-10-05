const User = require('../models/userModel')
const Order = require('../models/ordersModel')

const showOrders = async (req, res) => {
    try {
        const userId = req.session.userId
        const user = await User.User.findById(userId)
        const cart = user.cart
        const order = await Order.find({ customer: userId })
        const check = order.products
        const orders = await Order.find({ customer: userId }).populate('products');
        res.render('users/orders', { userId, user, orders, cart })
    } catch (error) {
        console.error(error)
        res.render('error')
    }
}

module.exports = {
    showOrders
}