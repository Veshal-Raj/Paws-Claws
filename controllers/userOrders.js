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

const cancelOrder = async (req, res) => {
    try {
        console.log('Checking in userorder.js cancel order controller');

        const orderNumber = req.params.orderId;
        const userId = req.session.userId;

        // Fetch the order details from the database
        const order = await Order.findOne({ orderNumber: orderNumber });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found ' });
        }

        const totalAmount = order.totalAmount;

        // Find the user using the user id in session
        const user = await User.User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (typeof totalAmount === 'number' && !isNaN(totalAmount)) {
            // Update the user's wallet balance
            user.wallet.balance += totalAmount;
        } else {
            // Handle the case where totalAmount is not a valid number
            // You might want to log an error message or handle it accordingly
            console.error("Invalid totalAmount:", totalAmount);
        }

        // Add a transaction detail or description for the refund
        user.wallet.transactions.push({
            description: `Refund for Order ID: ${orderNumber}`,
            amount: totalAmount,
        });

        // Save the user's updated wallet
        await user.save();

        // Update the order status to 'Cancelled'
        order.status = 'Cancelled';

        // Save the order
        await order.save();

        return res.json({ success: true, message: 'Order cancelled successfully', totalAmount, customer: user });

    } catch (error) {
        console.error(error);
        res.render('error');
    }
}


module.exports = {
    showOrders,
    cancelOrder
}