const Product = require('../models/productsModel')
const Subcategory  = require('../models/subcategoriesModel')
const Category = require('../models/categoriesModel');

const renderProductpage = async (req,res)=>{
    try {
        // Fetch all the product data from the database
        const products = await Product.find()
        
        // Fetch all categories from the database
         const categories = await Category.Category.find().populate('subcategories');
         const subcategories = await Subcategory.find();


        // render the product page with products
        res.render('admin/products',{products,categories,subcategories})
    } catch (error) {
        res.status(500).send('Internal Error')
        console.error(error);
    }
}

const addproduct = async (req,res) =>{
    try {
        console.log('hi')
        console.log(req.body)
        console.log(req.body.price)

        // Parse productPrice and productStock as integers
       // const price = parseInt(req.body.productPrice, 10);
        // const productStock = parseInt(req.body.productStock, 10);

        // Get product data from the form 
        const {
            productName,
            price,
            productDescription,
            quantityInStock,
            // productStock,
            productStatus,
        } = req.body
            console.log(req.body)
            console.log(req.body.price)

        // Create a new product document
        const newProduct = new Product({
            productName,
            price,
            productDescription,
            quantityInStock,
            productStatus
        })

// Save it to MongoDB
        await newProduct.save();
        // Redirect to the product list page after adding the product 
        res.redirect('/admin/products')
            
        } catch (error) {
            res.status(500).send('Internal Error')
            console.error(error)
        }
}

const fetchSucategories = async (req,res) =>{
    try {
        console.log("fetching categories")
        console.log(req.body)
        const categoryId = req.body.selectedCategoryId;
        const subcategories = await Subcategory.find({category:categoryId})
        console.log('hikkkkk')
        console.log(subcategories)
        res.json(subcategories)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error:'An error occured while fetching subcategories'})
    }
}

module.exports ={
    renderProductpage,
    addproduct,
    fetchSucategories
}