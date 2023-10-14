const User = require('../models/userModel')
const Order = require('../models/ordersModel')

const showOrders = async (req, res) => {
    try {
        const userId = req.session.userId;

        // Find the user by ID and project the cart and orders
        const user = await User.User.findById(userId).select('cart').lean();
        const orders = await Order.find({ customer: userId }).populate('products').lean();

        res.render('users/orders', { userId, user, orders });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
}


const cancelOrder = async (req, res) => {
    try {
        const orderNumber = req.params.orderId;
        const userId = req.session.userId;

        // Fetch the order and user details from the database
        const [order, user] = await Promise.all([
            Order.findOne({ orderNumber: orderNumber }).lean(),
            User.User.findById(userId).select('wallet').lean(),
        ]);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const totalAmount = order.totalAmount;

        if (typeof totalAmount === 'number' && !isNaN(totalAmount)) {
            // Update the user's wallet balance and add a transaction detail for the refund
            user.wallet.balance += totalAmount;
            user.wallet.transactions.push({
                description: `Refund for Order ID: ${orderNumber}`,
                amount: totalAmount,
            });

            // Save the user's updated wallet
            await User.User.findByIdAndUpdate(userId, { wallet: user.wallet }).lean();
        } else {
            console.error("Invalid totalAmount:", totalAmount);
            // Handle the case where totalAmount is not a valid number
        }

        // Update the order status to 'Cancelled'
        order.status = 'Cancelled';

        // Save the order
        await Order.findOneAndUpdate({ orderNumber: orderNumber }, { status: 'Cancelled' }).lean();

        return res.json({ success: true, message: 'Order cancelled successfully', totalAmount, customer: user });

    } catch (error) {
        console.error(error);
        res.render('error');
    }
};



module.exports = {
    showOrders,
    cancelOrder
}