const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

const homePageSearchbar = async (req, res) => {
    try {
        const query = req.query.query.toLowerCase();

        // Use Mongoose to find products that match the query and are not blocked
        const products = await Product.find({
            productName: { $regex: new RegExp(query, 'i') }, // Case-insensitive search
            isAvailable: true, // Ensure the product is not blocked
        })
        .populate('category subcategory') // Populate category and subcategory
        .exec();

        // Filter out products where the category or subcategory is blocked
        const filteredProducts = products.filter(product => {
            if (!product.category || !product.subcategory) {
                return false; // Handle products with missing category or subcategory
            }
            return !product.category.isDisabled && !product.subcategory.isDisabled;
        });

        // Send the matching and unblocked products as a JSON response
        res.json(filteredProducts);
    } catch (error) {
        console.error('Error:', error);
        res.render('somethingwentwrong');
    }
};


module.exports = {
    homePageSearchbar
}