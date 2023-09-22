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
         // Get product data from the form 
        const {
            productName,
            price,
            productDescription,
            quantityInStock,            
            productStatus,
        } = req.body


        const categoryId = req.body.category
        const subcategoryId = req.body.subcategory

            console.log(req.body)
            console.log(req.body.price)

            // Extract uploaded files and create an array of filenames
            const productImages = []
            req.files.forEach((file) => {
                productImages.push(file.filename)
            })

        // Create a new product document
        const newProduct = new Product({
            productName,
            price,
            productDescription,
            quantityInStock,
            productStatus,
            productImages,
            category:categoryId,
            subcategory:subcategoryId
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
        // console.log('hikkkkk')
        console.log(subcategories)
        res.json(subcategories)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error:'An error occured while fetching subcategories'})
    }
}

const productAvailability = async (req,res) => {
    try {
    
        const productId = req.body.productId;
        const isAvailable = req.body.isAvailable;

        console.log(productId,isAvailable)
        // Find the product by Id
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ fail: 'Product not found'})
        }

        // Toggle the availability
        product.isAvailable = !isAvailable;

        //Save the updated product to the database
        await product.save()

        res.json({ ok: 'Product availability updated successfully' });
    } catch (error) {
        console.error(error)
        res.json({fail:'It is not updated'})
    }
}
module.exports ={
    renderProductpage,
    addproduct,
    fetchSucategories,
    productAvailability
}