const Subcategory = require('../models/subcategoriesModel')
const Category = require('../models/categoriesModel');
const { response } = require('express');


// ===================== create a new sub-category ============================= //
const createSubCategory = async (req, res) => {
  try {
    const { subcategoryName, category } = req.body


    // Create a new subcategory
    const subcategory = await Subcategory.create({ subcategoryName, category });


   // Find the corresponding category and push the subcategory to its subcategories array
   const updatedCategory = await Category.Category.findByIdAndUpdate(
    category,
    { $push: { subcategories: subcategory._id } }, // Push the subcategory's objectId to the array
    { new: true }
  );

   // Redirect to the admin categories page after successful creation
    res.redirect('/admin/categories');

  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({ error: 'Internal Server Error!' })
    console.error(error);
  }
}


// ================ Get all subCategory for a specific Category =======================//

const getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    const [categories, subcategories] = await Promise.all([
      Category.Category.find().populate('subcategories'),
      Subcategory.find(),
    ]);

    res.render('admin/category', { categories, subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
};

// ======================== Render the subcategory page ================================ //
const renderSubcategoriesPage = async (req, res) => {
  try {
    const categoryId = req.params.categoryId

    // Retrieving the selected category's subcategories
    const subcategories = await Subcategory.find({ category: categoryId })

    // Fetch the category name based on categoryId (You need to implement this logic)
    const categoryName = await getCategoryNameByCategoryId(categoryId);

    // Render the subcategories.ejs template with subcategories data
    res.render('admin/subcategories', { subcategories, categoryName, categoryId })
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
const subcategoryEdit = async (req, res) => {
  try {
    // Extract the subcategory ID from the URL
    const subcategoryID = req.query.SubID 
    const categoryID = req.query.CatID

    const updatedSubcategoryName = req.body.editSubcategoryName // Extract the updated subcategory data from the request body

    const updatedSubcategory = await Subcategory.updateOne({ _id: subcategoryID }, { $set: { subcategoryName: updatedSubcategoryName } })

    if (!updatedSubcategory) {
      return res.status(404).send('Subcategory not found')
    }

    res.redirect(`/admin/subcategories/${categoryID}`)

  } catch (error) {
    res.status(500).send('Internal Error')
    console.error("Error", error)
  }
}


const subcategoryAvailable = async (req, res) => {
  try {
    const categoryId = req.query.CatID;
    const subcategoryId = req.query.SubCatID;

    

    res.redirect(`/admin/subcategories/${categoryId}`);
  } catch (error) {
    res.status(500).send('Internal Error');
    console.error("Error", error);
  }
}

// ======================= Making subcategory Not-Available ======================== //
const subcategoryNA = async (req, res) => {
  try {
    const subcategoryID = req.query.SubCatID;
    const categoryID = req.query.CatID;


    const category = await Category.Category.findOne({ _id: categoryID });

    if (!category) {
      // Handle the case where the category is not found
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryName = category.name;

    const subCategoryFind = await Subcategory.findByIdAndUpdate(
      subcategoryID,
      { $set: { isDisabled: false } }
    );

    if (!subCategoryFind) {
      return res.status(400).json({ message: 'No Subcategory Found' });
    }

    res.render('admin/subcategories', { subCategoryFind, categoryID, categoryName });
  } catch (error) {
    res.status(500).send('Internal Error');
    console.error('Error', error);
  }
};



module.exports = {
  createSubCategory,
  getAllCategoriesWithSubcategories,
  renderSubcategoriesPage,
  getCategoryNameByCategoryId,
  subcategoryEdit,
  subcategoryAvailable,
  subcategoryNA

}