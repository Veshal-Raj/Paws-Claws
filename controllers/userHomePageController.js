const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')
// const { default: products } = require('razorpay/dist/types/products')

// Function to retrieve a list of products based on block status
const showHomepageProducts = async (req, res) => {
    try {



        // Retrieve all products from the database
        const allProducts = await Product.find().populate('category subcategory')

        // Retrieve all categories from the database
        const allCategories = await Category.Category.find()


        // Retrieve all subcategories form the database
        const allSubcategories = await Subcategory.find()


        

        // Filter products based on block status of product, category, and subcategory
        const filteredProducts = allProducts.filter((product) => {
            const isProductBlocked = product.isAvailable; // true
            const category = allCategories.find((cat) => cat._id.equals(product.category._id));

            const isCategoryBlocked = category ? category.isDisabled : false;
            const subcategory = allSubcategories.find((subcat) => subcat._id.equals(product.subcategory._id))
            const isSubcategoryBlocked = subcategory ? subcategory.isDisabled : false;




            // Define your conditions herer (e.g., show product if none are blocked)
            return isProductBlocked && !isCategoryBlocked && !isSubcategoryBlocked
        })

        const totalProducts = filteredProducts.length
        const productsPerPage = 8 // Number of products to display per page

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProducts/productsPerPage)

        // Determine  the current page
        let currentPage = parseInt(req.query.page) || 1;
        if (currentPage < 1) currentPage = 1
        if (currentPage > totalPages) currentPage = totalPages

        // Calculate the index range for the current page
        const startIndex = (currentPage - 1) * productsPerPage
        const endIndex = Math.min(startIndex + productsPerPage,totalProducts)

        //Filter products based on the current page
        const productsToDisplay = allProducts.slice(startIndex,endIndex)

        res.render('users/home', {
             products: productsToDisplay,
              userId: req.session.userId ,
              totalPages: totalPages,
              currentPage:currentPage
            })
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}


module.exports = {
    showHomepageProducts,

}