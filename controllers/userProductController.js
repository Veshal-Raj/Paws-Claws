const Product = require('../models/productsModel')
const mongoose = require('mongoose'); // Import Mongoose
const User = require('../models/userModel')
const Order = require('../models/ordersModel')


const productSinglePageView = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.User.findById(userId);
        let cartQuantity = user ? user.cart.length : 0;

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
        
         // Calculate the average rating
    let averageRating = 0;
    if (product.rating.length > 0) {
      const totalRatings = product.rating.length;
      const sumOfRatings = product.rating.reduce((acc, curr) => acc + curr.rate, 0);
      averageRating = sumOfRatings / totalRatings;
    }
        console.log('average RAting: ',averageRating)


        // Query the user's orders
        const orders = await Order.find({ customer: userId });

        let hasPurchased = false;
        let orderStatus = null;

        // Iterate through the user's orders
        for (const order of orders) {
            // Check if the order contains the product with the specific productId
            const productInOrder = order.products.find(product => product.product_id.toString() === productId);

            if (productInOrder) {
                // Product is found in this order
                orderStatus = order.status;
                if (orderStatus === 'Delivered') {
                    hasPurchased = true;
                }
                break; // No need to continue checking other orders
            }
        }

        // Render the product details page with the product data and purchase information
        res.render('users/productSingleViewpage', { product, userId, cartQuantity, hasPurchased, orderStatus, averageRating });
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