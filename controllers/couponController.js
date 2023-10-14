const Coupon = require('../models/couponModel');
const User = require('../models/userModel');

const showCoupons = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(404).json({ error: 'User id in session not found.' });
        }

        // Find the user from the database
        const user = await User.User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Find coupons in the database
        const coupons = await Coupon.find();

        res.render('admin/coupon', { coupons, user });
    } catch (error) {
        console.error('Error in showCoupons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const createCoupon = async (req,res) => {
    console.log('checking')
    try {
        // Retrieve the form data from the request body
        const formData = req.body

        // Save the form data to the database using Mongoose
        const newCoupon = new Coupon(formData);
        const savedCoupon = await newCoupon.save();

        // Respond with the saved coupon and a success message
        res.status(201).json({
            message: 'Coupon saved successfully',
            coupon: savedCoupon,
        });

    } catch (error) {
        console.error('Error in create coupon ', error);
        res.status(500).json({ error: 'Internal server error '})
    }
}


const deleteCoupon = async (req,res) => {
    try {
        const couponId = req.params.id 
        const deletedCoupon = await Coupon.findByIdAndRemove(couponId)

        if (!deletedCoupon) {
            return res.status(404).json({ message: 'Coupon not found'})
        }

        res.json({ message: 'Coupon deleted successfully'})
    } catch (error) {
        console.error('Error in delete coupon',error);
        res.status(500).json({ error: 'Internal server error '})
    }
}


module.exports = {
    showCoupons,
    createCoupon,
    deleteCoupon
};
