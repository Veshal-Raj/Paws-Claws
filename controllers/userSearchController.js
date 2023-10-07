const Product = require('../models/productsModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')

const homePageSearchbar = async (req,res) => {
    try {
        const query = req.query.query.toLowerCase()

        // Use Mongoose to find products that match the query
        const products = await Product.find({
            productName: { $regex: new RegExp(query,'i')} // Case-insensitnve  search
        }).exec()

        res.json(products)
    } catch (error) {
        console.error('Error:',error);
        res.render('somethingwentwrong')
    }
}


module.exports = {
    homePageSearchbar
}