const Product = require('../models/productsModel')
const Subcategory  = require('../models/subcategoriesModel')
const Category = require('../models/categoriesModel');

const renderProductpage = async (req,res)=>{
    try {
        // Fetch all the product data from the database
        const products = await Product.find()

        // render the product page with products
        res.render('admin/products',{products})
    } catch (error) {
        res.status(500).send('Internal Error')
        console.error(error);
    }
}

const addproduct = async (req,res) =>{
    try {
        console.log('hi')
        console.log(req.body)
        console.log(req.body.productPrice)

        // Parse productPrice and productStock as integers
        const productPrice = parseInt(req.body.productPrice, 10);
        const productStock = parseInt(req.body.productStock, 10);

        // Get product data from the form 
        const {
            productName,
            // productPrice,
            productDescription,
            // productStock,
            productStatus,
        } = req.body
console.log(req.body)
console.log(req.body.productPrice)

        // Create a new product document
        const newProduct = new Product({
            productName,
            productPrice,
            productDescription,
            productStock,
            productStatus
        })

        // Save the new product to the database
        await newProduct.save()

        // Redirect to the product list page after adding the product 
        res.redirect('/admin/products')
    } catch (error) {
        res.status(500).send('Internal Error')
        console.error(error)
    }
}

module.exports ={
    renderProductpage,
    addproduct
}