const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

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


        res.render('users/home', { products: filteredProducts, userId: req.session.userId })
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

module.exports = {
    showHomepageProducts,
}