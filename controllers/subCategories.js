const Subcategory  = require('../models/subcategoriesModel')
const Category = require('../models/categoriesModel');
const { response } = require('express');


// ===================== create a new sub-category ============================= //
const createSubCategory = async (req,res)=>{
    try {
        const { subcategoryName, category} = req.body

        // Fetch all categories from the database
        const categories = await Category.Category.find()
        
        // Create a new subcategory
        const subcategory = new Subcategory({subcategoryName,category})
        const savedSubcategory = await subcategory.save()

        // take all the subcategories from the savedsubcategory  and push it to the category-->subcategory-->field(push)
        // const subcategories = await Category.Category.find()
        // console.log(savedSubcategory    )
        // res.redirect('/admin/categories')
        
        // find the corresponding category and push the subcategory to its subcategory array
        const upadatedCategory = await Category.Category.findByIdAndUpdate(
          category,
          {$push: {subcategories: savedSubcategory._id}}, // Push the subcategory's objectId to the array
          {new: true}
        )
          res.redirect('/admin/categories')
    } catch (error) {
        res.status(500).json({ error:'Internal Server Error!' })
        console.error(error);   
    }
}


// Get all subCategory for a specific Category

const getAllCategoriesWithSubcategories = async (req, res) => {
    try {

      const categories = await Category.Category.find().populate('subcategories');
      console.log(categories)
      const subcategories = await Subcategory.find();

    
      res.render('admin/category',{ categories, subcategories });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error!' });
      console.error(error);
    }
  };



// Get all categories
// const getAllCategories = async (req,res)=>{
//     try {
//         const categories = await Category.Category.find()
//         console.log(categories)
//         res.render('admin/category',{categories})

//     } catch (error) {
//         res.status(500).json({ error:'Internal Server Error! '})
//         console.error(error);
//     }
// }

















// const displaySubcategories = async (req,res) =>{
//     try {
//         const categoryId = req.params.categoryId

//         res.render('subcategories',{categoryId,subcategory})
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error!'})
//     }
// }




module.exports = {
    createSubCategory,
    getAllCategoriesWithSubcategories
    
}