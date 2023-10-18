const Coupon = require('../models/couponModel')

const couponUsing = async (req, res) => {
    console.log(req)
    console.log('reaching here');
    try {
        console.log('checking in coupon controller, user side');
        const couponCodeValue = req.body.couponCodeValue; // Access the entire request body
        console.log(couponCodeValue);
        

        const couponValue = await Coupon.find({ code: couponCodeValue });
        console.log('coupon code', couponValue);
        
        // You can send a response back to the client with couponValue
        res.json(couponValue);
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send('Error occurred');
    }
}

module.exports = {
    couponUsing
}