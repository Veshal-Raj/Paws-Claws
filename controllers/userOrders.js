const User = require('../models/userModel')
const Order = require('../models/ordersModel')

const showOrders = async (req, res) => {
    try {
        const userId = req.session.userId;

        
        const userCartQuantity = await User.User.findById(userId);
    

           let cartQuantity
        if (userCartQuantity){
            cartQuantity = userCartQuantity.cart.length;

        }

        // Find the user by ID and project the cart and orders
        const user = await User.User.findById(userId).select('cart').lean();
        const orders = await Order.find({ customer: userId })
        console.log('orders',orders)

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

        // Define cartQuantity or retrieve it from somewhere if needed
        const cartQuantity = 0; // Replace with the actual value

        return res.json({ success: true, message: 'Order cancelled successfully', totalAmount, customer: user, cartQuantity});

    } catch (error) {
        console.error(error);
        res.render('error');
    }
};


const viewInvoice = async (req,res) => {
    try {
        const orderNumber = req.query.orderNumber
        const userId = req.session.userId;
        console.log(orderNumber)

        const userCartQuantity = await User.User.findById(userId);
        const userName = await User.User.findById(userId);
console.log(userName.fullname)
           let cartQuantity
        if (userCartQuantity){
            cartQuantity = userCartQuantity.cart.length;

        }


        const user = await User.User.findById(userId).select('cart').lean();

        const order = await Order.findOne({ orderNumber:orderNumber})
        console.log('orders: ', order)
        
        res.render('users/invoice', {user,userId,cartQuantity, order, userName})
    } catch (error) {
        
    }
}


module.exports = {
    showOrders,
    cancelOrder,
    viewInvoice
}