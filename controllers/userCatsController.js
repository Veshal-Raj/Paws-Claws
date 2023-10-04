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

module.exports = {
    cats
}