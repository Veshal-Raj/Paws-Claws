const Category = require('../models/categoriesModel')
const Banner = require('../models/bannerModel')
const fs = require('fs').promises


// =================== show banner ========================== //
const showBanner = async (req,res) => {
    try {
        // Fetching all the categories
        const categories = await Category.Category.find()

        
        // Fetch all the available banners from the database
        const bannersCategory = await Banner.find({ isAvailable: true}).populate('category').lean() 
        // Get the count of existing banners
        const bannerCount = await Banner.countDocuments();

        //  Render the banner page
        res.render('admin/banner', {categories,bannersCategory, bannerCount})
    } catch (error) {
        console.error(error);
        res.render('somethingwentwrong')
    }
}


const saveBanner = async (req,res) => { 
    try {
        const category = req.body.category; // Access other form data
        const bannerImage = req.file; // Access the uploaded image file
       
        const bannerImg = req.file.filename; // Access the uploaded image file
        
        // Create a new Banner instance with the data
        const newBanner = new Banner({
            category: category,
            imageUrl: bannerImg,
        })

        // Save the new banner to the database
        await newBanner.save()

        // Respond with a success message or redirect to a success page
        res.redirect('/admin/banner')
     
      
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal Server Error'})
    }
}


const deleteBanner = async (req,res) => {
    const bannerId = req.params.bannerId;
  
    try {
      // Find the banner by ID and remove it from the database
      const result = await Banner.findByIdAndRemove(bannerId);
      if (result) {
        res.sendStatus(204); // No Content - successful deletion
      } else {
        res.status(404).json({ error: 'Banner not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


// ====================== Banner Status ======================== //
const bannerStatus = async (req,res) => {
    const bannerId = req.params.bannerId
    try {
            const banner = await Banner.findById(bannerId)

            if (!banner) {
                return res.status(404).json({ message: 'Banner not found' });
            }

            // Changing banenr status
            banner.isActive = !banner.isActive

            await banner.save()
            res.status(200).json({ message: 'Banner status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
    }
}


module.exports = {
    showBanner,
    saveBanner,
    deleteBanner,
    bannerStatus
}