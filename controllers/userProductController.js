const Product = require('../models/productsModel')
const mongoose = require('mongoose'); // Import Mongoose


const productSinglePageView = async (req, res) => {
    try {
        // Get the product ID from the query parameter
        const productId = req.query.productId;

        console.log('Received productId:', productId); // Debugging
        
        // Check if productId is defined and is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {

            return res.status(400).send('Invalid product ID');
        }

        // Retrieve the product based on the productId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Rendering the product details page with the product data
        res.render('users/productSingleViewpage', { product });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
};``

module.exports = {
    productSinglePageView
}