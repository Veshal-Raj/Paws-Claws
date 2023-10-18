const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')
const User = require('../models/userModel')
const Banner = require('../models/bannerModel')

// Function to retrieve a list of products based on block status
const showHomepageProducts = async (req, res) => {
    try {

         // Taking the count of products in the cart
         const userId = req.session.userId;
         const user = await User.User.findById(userId);
        

            let cartQuantity
         if (user){
             cartQuantity = user.cart.length;

         }
        

        // Number of products to display per page
        const productsPerPage = 8;

        // Determine the current page based on the query parameter, default to page 1
        let currentPage = parseInt(req.query.page) || 1;
        currentPage = Math.max(1, currentPage); // Ensure currentPage is at least 1

        // Calculate the number of products to skip based on the current page
        const skip = (currentPage - 1) * productsPerPage;

        // Retrieve products from the database where isAvailable is true,
        // populate category and subcategory data, skip unwanted products, and limit to productsPerPage
        const filteredProducts = await Product
            .find({
                isAvailable: true
            })
            .populate('category subcategory')
            .skip(skip)
            .limit(productsPerPage)
            .lean(); // Convert documents to plain JavaScript objects

        // Count the total number of available products in the database
        const totalProducts = await Product.countDocuments({ isAvailable: true });

        
        // Calculate the total number of pages required for pagination
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        // Fetch all the available banners from the database
        const banners = await Banner.find({ isAvailable: true }).lean() 
            

        // Render the 'users/home' view with the filtered products and pagination data
        res.render('users/home', {
            products: filteredProducts,
            userId: req.session.userId, // Pass the user ID if available
            totalPages, // Total number of pages for pagination
            currentPage, // Current page number
            cartQuantity,
            banners
        });
    } catch (error) {
        // In case of an error, render an 'error' view and log the error
        res.render('error');
        console.error(error);
    }
}




module.exports = {
    showHomepageProducts,

}