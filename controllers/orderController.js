const Order = require('../models/ordersModel')
const User = require('../models/userModel')

const showOrders = async (req,res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find().populate('customer', 'fullname');

        // Render the 'OrdersAdmin' template and pass the orders data
        res.render('admin/ordersAdmin',{orders})
    } catch (error) {
        console.error(error);
        res.render('somethingwentwrong')
    }
}


const updateOrderStatus = async (req,res) => {
    
    try {
        const { orderId, newStatus } = req.body
            console.log('order id', orderId)
            console.log('newstatus', newStatus)
        // Find the order by ID and update its status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true } // To get the updated document
        )

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' })
        }

        // Send the updated order as a JSON response
        res.json(updatedOrder)
    } catch (error) {
        console.error('Error updating order status: ', error);
        res.render('somethingwentwrong')
    }
}


const cancelOrder = async (req,res) => {
    try {
        
        const orderNumber = req.body.orderNumber;
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
        
    }
}

module.exports = {
    showOrders,
    updateOrderStatus,
    cancelOrder
}