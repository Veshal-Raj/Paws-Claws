const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

const dogs = async (req, res) => {
    try {
        // Number of products to display per page
        const productsPerPage = 8;

        // Find the "Dog" category
        const dogCategory = await Category.Category.findOne({ categoryName: 'Dog' });

        // Count the total number of available products in the "Dog" category
        const totalProducts = await Product.countDocuments({
            category: dogCategory,
            isAvailable: true,
        });

        // Calculate the total number of pages required for pagination
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        // Determine the current page based on the query parameter, default to page 1
        let currentPage = parseInt(req.query.page) || 1;
        currentPage = Math.max(1, Math.min(currentPage, totalPages));

        // Calculate the number of products to skip based on the current page
        const skip = (currentPage - 1) * productsPerPage;

        // Find and populate products belonging to the "Dog" category, apply pagination
        const dogProducts = await Product.find({
            category: dogCategory,
            isAvailable: true,
        })
        .populate('category subcategory')
        .skip(skip)
        .limit(productsPerPage)
        .lean(); // Convert documents to plain JavaScript objects

        res.render('users/dogs', {
            products: dogProducts,
            userId: req.session.userId,
            totalPages,
            currentPage,
        });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
}


const filterDogProducts = async (req, res) => {
    try {
        // Get the search query from the request query parameters with a default of an empty string
        const searchQuery = req.query.query || '';

        // Find the "Dog" category
        const dogCategory = await Category.Category.findOne({ categoryName: 'Dog' });

        if (!dogCategory) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Create a query object for filtering products
        const query = {
            category: dogCategory,
            isAvailable: true, // Filter available products
        };

        if (searchQuery) {
            // If a search query is provided, add a condition to search by product name
            query.productName = { $regex: searchQuery, $options: 'i' };
        }

        // Find and populate products matching the query
        const filteredDogProducts = await Product.find(query)
            .populate('category subcategory')
            .lean(); // Convert documents to plain JavaScript objects

        // Send the filtered products as a JSON response
        res.json(filteredDogProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    dogs,
    filterDogProducts
}


