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

        res.render('users/dogs', { products: dogProducts, userId: req.session.userId })

    } catch (error) {
        console.error(error);
        res.render('error')
    }
}

const filterDogProducts = async (req,res) => {
    try {
        // Find the 'Dog' category
        const  dogCategory = await Category.Category.findOne({categoryName: 'Dog'})

        if (!dogCategory) {
            console.error(error)
            return res.redirect('/error')
        }

        // Get the search query from the request query paramaters
        const searchQuery = req.query.query || ''  // Default to an empty string if query parameter is not provided


        // Find all products that belong to the "Dog" category and match the search input in the product name
        const filteredDogProducts = await Product.find({
            category: dogCategory,
            isAvailable: true, // Filter available products
            productName: {$regex: searchQuery, $options: 'i'} // Case-insensitive search 
        }).populate('category subcategory') 

        // Send the filtered products as JSON response
        res.json(filteredDogProducts)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {
    dogs,
    filterDogProducts
}


