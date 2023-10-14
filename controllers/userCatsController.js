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

        const totalProducts = catProducts.length
        const productsPerPage = 8 // Number of products to display per page

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProducts/productsPerPage)

        // Determine the current page
        let currentPage = parseInt(req.query.page) || 1
        if (currentPage < 1) currentPage = 1
        if (currentPage > totalPages) currentPage = totalPages

        // Calculate the index range for the current page
        const startIndex = (currentPage - 1) * productsPerPage
        const endIndex = Math.min(startIndex + productsPerPage,totalProducts)

        // Filter products based  on the current page
        const productsToDisplay = catProducts.slice(startIndex,endIndex)

        res.render('users/cats',{
            products: productsToDisplay, 
            userId: req.session.userId,
            totalPages: totalPages,
            currentPage:currentPage
        })

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