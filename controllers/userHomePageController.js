const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

// Function to retrieve a list of products based on block status
const showHomepageProducts = async (req,res) => {
    try {
        // console.log('show home')


        // Retrieve all products from the database
        const allProducts = await Product.find().populate('category subcategory')
        // console.log('all products',allProducts)

        // Retrieve all categories from the database
        const allCategories = await Category.Category.find()
        // console.log('all categories',allCategories)


        // Retrieve all subcategories form the database
        const allSubcategories = await Subcategory.find()
        // console.log('allsubcategories: ',allSubcategories)
        

        // Filter products based on block status of product, category, and subcategory
        const filteredProducts = allProducts.filter((product) => { 
            const isProductBlocked = product.isAvailable; // true
            const category = allCategories.find((cat) => cat._id.equals(product.category._id));
            // console.log(category.isBlocked)
            const isCategoryBlocked = category ? category.isDisabled : false;
            const subcategory = allSubcategories.find((subcat) => subcat._id.equals(product.subcategory._id))
            const isSubcategoryBlocked = subcategory ? subcategory.isDisabled : false;

            // console.log('Product:', product.productName);

            // console.log('isProductBlocked:', isProductBlocked);
            // console.log('Category:',category)
            // console.log('isCategoryBlocked:', isCategoryBlocked);
            // console.log('Subcategory:',subcategory)
            // console.log('isSubcategoryBlocked:', isSubcategoryBlocked);
        

            // Define your conditions herer (e.g., show product if none are blocked)
            return isProductBlocked && !isCategoryBlocked && !isSubcategoryBlocked
        })
        

        res.render('users/home', {products: filteredProducts})
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

module.exports = {
    showHomepageProducts,
}