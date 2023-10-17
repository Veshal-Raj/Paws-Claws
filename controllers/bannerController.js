const Category = require('../models/categoriesModel')
const Banner = require('../models/bannerModel')
const fs = require('fs').promises


// =================== show banner ========================== //
const showBanner = async (req,res) => {
    try {
        // Fetching all the categories
        const categories = await Category.Category.find()

        //  Render the banner page
        res.render('admin/banner', {categories})
    } catch (error) {
        console.error(error);
        res.render('somethingwentwrong')
    }
}


const saveBanner = async (req,res) => { 
    try {
        const category = req.body.category; // Access other form data
        const bannerImage = req.file; // Access the uploaded image file
        console.log(bannerImage)
        const bannerImg = req.file.filename; // Access the uploaded image file
        console.log(bannerImg)

        // Create a new Banner instance with the data
        const newBanner = new Banner({
            category: category,
            imageUrl: bannerImg,
        })

        // Save the new banner to the database
        await newBanner.save()

        // Respond with a success message or redirect to a success page
        res.status(201).json({message:'Banner added successfully'})
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal Server Error'})
    }
}


module.exports = {
    showBanner,
    saveBanner
}