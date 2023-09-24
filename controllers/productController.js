const Product = require('../models/productsModel')
const Subcategory  = require('../models/subcategoriesModel')
const Category = require('../models/categoriesModel');
const fs = require('fs').promises

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
 
        const categoryId = req.body.selectedCategoryId;
        const subcategories = await Subcategory.find({category:categoryId})
        
        
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

        
        // Find the product by Id
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ fail: 'Product not found'})
        }

        // Toggle the availability
        product.isAvailable = !isAvailable;

        //Save the updated product to the database
        await product.save()

        res.status(200).json({ response: 'ok' });
    } catch (error) {
        console.error(error)
        res.render('error')
    }
}


const deleteImage = async (req,res) => {
    try {
        const {productId,imageUrl} = req.body // sending product id and the index from the client

        // Fetch the product document from the database
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }

        // Check if the index is within valid bounds
        // if (imageUrl < 0 || index >= product.productImages.length) {
        //     return res.status(400).json({ message: 'Invalid image index' });
        // }

        // Get image file name to delete
        // const imageNameToDelete= product.productImages[index]
        let indexToDelete =-1
        for(let i=0;i<product.productImages.length;i++) {
            if (product.productImages[i] === imageUrl ) {
                indexToDelete = i
                break
            }
        }

        console.log(indexToDelete)

        if (indexToDelete === -1) {
            return res.status(404).json({message:'Image is not found'})
        }

         // Construct the path to the image file
         const imagePath = `./public/uploads/${imageUrl}`;

         // Delete the file from the server's file system
        await fs.unlink(imagePath);

        // Remove the image name from the product's array
        product.productImages.splice(indexToDelete, 1);

        // Save the updated product document
        await product.save();

        return res.status(200).json({message:'Image delete successfully'})

    } catch (error) {
        console.error(error);
        res.render('error')
    }
}

module.exports ={
    renderProductpage,
    addproduct,
    fetchSucategories,
    productAvailability,
    deleteImage
}