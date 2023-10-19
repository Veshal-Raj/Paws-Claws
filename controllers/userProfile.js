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

const updateFullName = async (req,res) => {
    try {
        console.log('reached')
        const { userId, newFullName } = req.body;

        // Find the user by ID and update the full name
        await User.User.findByIdAndUpdate(userId, { fullname: newFullName })

        // Respond with a success message or data if needed
        res.json({ success: true, message: 'Full name updated successfully '})
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update full name' })
    }
}

module.exports = {
    showUserProfile,
    updateFullName
}