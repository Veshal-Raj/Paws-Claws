const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

const cats = async (req,res) => {
    try {

        // Find the "Cat" category
        const catCategory = await Category.Category.findOne({categoryName: 'Cat'})

        // Find all products that belong to the "Cat " category
        const catProducts = await Product.find({
            category: catCategory,
            isAvailable: true, // Filter available products 
        }).populate('category subcategory')

        res.render('users/cats',{products: catProducts, userId: req.session.userId})

    } catch (error) {
        console.error(error);
        res.render('error')
    }
}



// Function to filter products in the "Cat" category based on search input
const filterCatProducts = async (req,res) => {
    try {
        // Find the "Cat" category
        const catCategory = await Category.Category.findOne({categoryName: 'Cat'})

        if (!catCategory) {
            console.error(error)
            return res.redirect('/error');
        }

        // Get the search query from the request query parameters
        const searchQuery = req.query.query || ''  // Default to an empty string  if query parameter is not provided

        // Find all products that belong to the "Cat" category and match the search input in the product name
        const filteredCatProducts = await Product.find({
            category: catCategory,
            isAvailable: true, // Filter available products
            productName: {$regex: searchQuery, $options: 'i'} // Case-insensitive search
        }).populate('category subcategory')

        // Send the filtered products as JSON response
        res.json(filteredCatProducts)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error'})
    }
}
module.exports = {
    cats,
    filterCatProducts
}