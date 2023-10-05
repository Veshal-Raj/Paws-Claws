const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

const dogs = async (req, res) => {
    try {

        // Find the "Cat" category
        const dogCategory = await Category.Category.findOne({ categoryName: 'Dog' })

        // Find all products that belong to the "Dog " category
        const dogProducts = await Product.find({
            category: dogCategory,
            isAvailable: true, // Filter available products 
        }).populate('category subcategory')

        res.render('users/cats', { products: dogProducts, userId: req.session.userId })

    } catch (error) {
        console.error(error);
        res.render('error')
    }
}

module.exports = {
    dogs
}


