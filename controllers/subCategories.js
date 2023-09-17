const Subcategory  = require('../models/subcategoriesModel')
const Category = require('../models/categoriesModel');
const { response } = require('express');


// ===================== create a new sub-category ============================= //
const createSubCategory = async (req,res)=>{
    try {
        const { subcategoryName, category} = req.body

        // Fetch all categories from the database
        const categories = await Category.Category.find()
        // console.log(categories);
        
        // Create a new subcategory
        const subcategory = new Subcategory({subcategoryName,category})
        const savedSubcategory = await subcategory.save()

        
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


// ================ Get all subCategory for a specific Category =======================//

const getAllCategoriesWithSubcategories = async (req, res) => {
    try {
      const categories = await Category.Category.find().populate('subcategories');
      const subcategories = await Subcategory.find();

      res.render('admin/category',{ categories, subcategories });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error!' });
      console.error(error);
    }
  };

// ======================== Render the subcategory page ================================ //
const renderSubcategoriesPage = async (req,res)=>{
    try {
      const categoryId = req.params.categoryId

      // Retrieving the selected category's subcategories
      const subcategories = await Subcategory.find({category:categoryId})

      // Fetch the category name based on categoryId (You need to implement this logic)
      const categoryName = await getCategoryNameByCategoryId(categoryId);

      // Render the subcategories.ejs template with subcategories data
      res.render('admin/subcategories',{subcategories,categoryName})
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error!' });
      console.error(error);
    }
}

const getCategoryNameByCategoryId = async (categoryId) => {
  try {
    const category = await Category.Category.findById(categoryId);
    if (!category) {
      return null; // Return null if category is not found
    }
    return category.categoryName;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ================== Editing Subcategory ================================ //
const subcategoryEdit = async (req,res) =>{
  try {
    const subcategoryID = req.query.SubID // Extract the subcategory ID from the URL
    console.log("subcategory Id",subcategoryID)
    const updatedSubcategoryName = req.body.editSubcategoryName // Extract the updated subcategory data from the request body
    
    console.log("UpadatedSubCategoryName: ",updatedSubcategoryName)

    const updatedSubcategory = await Subcategory.updateOne({_id:subcategoryID},{$set:{subcategoryName:updatedSubcategoryName}})
    
    if(!updatedSubcategory) {
      return res.status(404).send('Subcategory not found')
    }

    res.redirect('/admin/subcategories')

    // if this redirect is not working then, use this ---> adminRoute.post('/subcategories/:categoryId', subcategoryController.renderSubcategoriesPage); // Render subcategory page


  } catch (error) {
    res.status(500).send('Internal Error')
    console.log("Error",error)
  }
}

// ====================== Making subcategory Available =========================== //
const subcategoryAvailable = async (req,res) =>{
  try {
    const subcategoryID = req.params.subcategoryID
    console.log(subcategoryID)
    const subCategoryFind = await Subcategory.findByIdAndUpdate(subcategoryID,{$set:{isDisabled:true}})
    console.log("updated data is ",subCategoryFind)
    if(!subCategoryFind){
      return  res.status(400).json({message:"No category found"})
    }
    res.redirect('/admin/subcategories')

  } catch (error) {
    res.status(500).send('Internal Error')
    console.log("Error",error)
  }
}

// ======================= Making subcategory Not-Available ======================== //
const subcategoryNA = async(req,res) =>{
  try {
    const subcategoryID = req.params.categoryId
    console.log("checking subcategory Id ",subcategoryID)
    const subCategoryFind = await Subcategory.findByIdAndUpdate(subcategoryID,{$set:{isDisabled:true}})
    console.log("updated data is ",subCategoryFind);

    if(!subCategoryFind) {
      return   res.status(400).json({message:'no Category Found'})
    }
    res.redirect('/admin/subcategories')
  } catch (error) {
    res.status(500).send('Internal Error')
    console.log("Error",error)
  }
}

module.exports = {
    createSubCategory,
    getAllCategoriesWithSubcategories,
    renderSubcategoriesPage,
    getCategoryNameByCategoryId ,
    subcategoryEdit,
    subcategoryAvailable,
    subcategoryNA
  
}