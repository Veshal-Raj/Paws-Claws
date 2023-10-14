const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

const cats = async (req, res) => {
    try {
        const productsPerPage = 8;

        // Find the "Cat" category
        const catCategory = await Category.Category.findOne({ categoryName: 'Cat' });

        // Count the total number of available products in the "Cat" category
        const totalProducts = await Product.countDocuments({
            category: catCategory,
            isAvailable: true,
        });

        // Calculate the total number of pages required for pagination
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        // Determine the current page based on the query parameter, default to page 1
        let currentPage = parseInt(req.query.page) || 1;
        currentPage = Math.max(1, Math.min(currentPage, totalPages));

        // Calculate the number of products to skip based on the current page
        const skip = (currentPage - 1) * productsPerPage;

        // Find and populate products belonging to the "Cat" category, apply pagination
        const catProducts = await Product.find({
            category: catCategory,
            isAvailable: true,
        })
        .populate('category subcategory')
        .skip(skip)
        .limit(productsPerPage)
        .lean(); // Convert documents to plain JavaScript objects

        // Filter out products where the subcategory is blocked
        const unblockedCatProducts = catProducts.filter(product => {
            // Assuming subcategory has an 'isBlocked' field
            return !product.subcategory || !product.subcategory.isBlocked;
        });

        res.render('users/cats', {
            products: unblockedCatProducts,
            userId: req.session.userId,
            totalPages,
            currentPage,
        });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
}




// Function to filter products in the "Cat" category based on search input
const filterCatProducts = async (req, res) => {
    try {
        // Get the search query from the request query parameters with a default of an empty string
        const searchQuery = req.query.query || '';

        // Find the "Cat" category
        const catCategory = await Category.Category.findOne({ categoryName: 'Cat' });

        if (!catCategory) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Create a query object for filtering products
        const query = {
            category: catCategory,
            isAvailable: true, // Filter available products
        };

        if (searchQuery) {
            // If a search query is provided, add a condition to search by product name
            query.productName = { $regex: searchQuery, $options: 'i' };
        }

        // Find and populate products matching the query
        const filteredCatProducts = await Product.find(query)
            .populate('category subcategory')
            .lean(); // Convert documents to plain JavaScript objects

        // Send the filtered products as a JSON response
        res.json(filteredCatProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = {
    cats,
    filterCatProducts
}