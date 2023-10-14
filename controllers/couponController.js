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


const createCoupon = async (req, res) => {
    try {
        const formData = req.body;

        // Server-side validation
        if (
            formData.discount < 0 ||
            formData.discountValue < 0 ||
            formData.minimumPurchase < 0 ||
            formData.usesLeft < 0
        ) {
            return res.status(400).json({ error: 'Values must be non-negative.' });
        }

        // Ensure case sensitivity and trim the coupon code
        formData.code = formData.code.trim(); // Trim leading/trailing white spaces
        const existingCoupon = await Coupon.findOne({ code: formData.code });

        if (existingCoupon) {
            return res.status(400).json({ error: 'Coupon code already exists.' });
        }

        // Save the form data to the database using Mongoose
        const newCoupon = new Coupon(formData);
        const savedCoupon = await newCoupon.save();

        res.status(201).json({
            message: 'Coupon saved successfully',
            coupon: savedCoupon,
        });

    } catch (error) {
        console.error('Error in create coupon', error);
        res.status(500).json({ error: 'Internal server error' });
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
