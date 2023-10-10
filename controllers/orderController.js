const Order = require('../models/ordersModel')


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

module.exports = {
    showOrders,
    updateOrderStatus
}