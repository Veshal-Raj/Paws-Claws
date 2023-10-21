const Product = require('../models/productsModel')
const mongoose = require('mongoose'); // Import Mongoose
const User = require('../models/userModel')


const productSinglePageView = async (req, res) => {
    try {
        

        const userId = req.session.userId;
         const user = await User.User.findById(userId);
         
            let cartQuantity
         if (user){
             cartQuantity = user.cart.length;

         }

        // Get the product ID from the query parameter
        const productId = req.query.productId;

        // Check if productId is defined and is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send('Invalid product ID');
        }

        // Retrieve the product based on the productId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Render the product details page with the product data
        res.render('users/productSingleViewpage', { product, userId: req.session.userId ,cartQuantity});
    } catch (error) {
        console.error(error);
        res.render('error');
    }
};


const addReview = async (req,res) => {
    try {
        const userId = req.session.userId
        const data = req.body
        console.log(data)
        const review = data.review
        const rating = data.rating
        const productId = data.product_id

        const newReview = {
            rate: rating,
            review: review,
            customer: userId, // Assuming you have a reference to the customer's ID
        };

        const product = await Product.findByIdAndUpdate(
                {_id: productId},
                { $push: { rating: newReview }},
                { new: true }
            );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(201).json({ message: 'Review added successfully ', product})


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}





module.exports = {
    productSinglePageView,
    addReview
}