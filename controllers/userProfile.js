const User = require('../models/userModel')
const Order = require('../models/ordersModel')

const showUserProfile = async (req,res) => {
    try {
        const userId = req.session.userId
        console.log(userId)
        const user = await User.User.findById(userId)
        console.log('user details ',user)
        const userCartQuantity = await User.User.findById(userId);
        
           let cartQuantity
        if (userCartQuantity){
            cartQuantity = userCartQuantity.cart.length;

        }

        // const orders = await Order.findById({customer:userId})
        // console.log(orders)

        const orders = await Order.find({ customer: userId })
        console.log('orders',orders.length)
        const numberOfOrders = orders.length


        res.render('users/account',{ userId,user,cartQuantity, orders, numberOfOrders})
    } catch (error) {
        
    }
}

module.exports = {
    showUserProfile
}