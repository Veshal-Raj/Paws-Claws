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

        // Create an array of objects with both index and coupon data
        const couponsWithIndex = coupons.map((coupon, index) => ({
            index,
            coupon
        }));
        
        res.render('admin/coupon', {  user, coupons: couponsWithIndex });
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

const getCoupon = async(req,res) => {

    try {

        const couponId = req.params.couponId;
        // Query the database to retrieve the coupon data by ID
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
          return res.status(404).json({ error: 'Coupon not found' });
        }
        // Send the coupon data as JSON response
        res.json(coupon);

    } catch (error) {
        console.error('Error in getting coupon ', error)
        res.status(500).json({error: 'Internal server error'})
    }
}

const updateCouponStatus = async (req,res) => {
 
        const couponId = req.params.couponId;
        const { currentStatus } = req.body;
      
        try {
          // Find the coupon by ID
          const coupon = await Coupon.findById(couponId);
      
          if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
          }
      
          // Update the coupon's status based on the current status
          coupon.isActive = currentStatus === 'active' ? false : true;
          
          // Save the updated coupon in the database
          await coupon.save();
      
          // Return the new status as a JSON response
          res.json({ newStatus: coupon.isActive ? 'active' : 'inactive' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = {
    showCoupons,
    createCoupon,
    getCoupon,
    updateCouponStatus
};
