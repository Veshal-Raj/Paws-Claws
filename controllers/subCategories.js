const Subcategory = require('../models/subcategoriesModel')
const Category = require('../models/categoriesModel');
const { response } = require('express');


// ===================== create a new sub-category ============================= //
const createSubCategory = async (req, res) => {
  try {
    const { subcategoryName, category } = req.body;

    // Validation: Check if subcategoryName is provided and not empty
    if (!subcategoryName || subcategoryName.trim() === "") {
      // return res.status(400).json({ error: 'Subcategory name is required' });
      return res.redirect('/admin/categories?error=Subcategory name is required!');
    }

    // Validation: Check if category is a valid category ID
    const existingCategory = await Category.Category.findById(category);
    if (!existingCategory) {
      // return res.status(404).json({ error: 'Category not found' });
      return res.redirect('/admin/categories?error=Category not found!');
    }

    // Validation: Check if subcategoryName is unique within the category (case-insensitive)
    const isDuplicateSubcategory = await Subcategory.findOne({
      subcategoryName: {
        $regex: new RegExp(`^${subcategoryName}$`, 'i'), // Case-insensitive comparison
      },
      category: category,
    });

    if (isDuplicateSubcategory) {
      // return res.status(400).json({ error: 'Subcategory name must be unique within the category' });
      return res.redirect('/admin/categories?error=Subcategory name must be unique within the category!');
    }

    // Create a new subcategory
    const subcategory = await Subcategory.create({ subcategoryName, category });

    // Check if the subcategory was successfully added to the category
    if (existingCategory.subcategories.indexOf(subcategory._id) === -1) {
      // return res.status(500).json({ error: 'Failed to add subcategory to the category' });
      return res.redirect('/admin/categories?error=Failed to add subcategory to the category!');
    }

    // Redirect to the admin categories page after successful creation
    res.redirect('/admin/categories');
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
};



// ================ Get all subCategory for a specific Category =======================//

const getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    const [categories, subcategories] = await Promise.all([
      Category.Category.find().populate('subcategories'),
      Subcategory.find(),
    ]);

    const error = req.query.error;

    res.render('admin/category', { categories, subcategories, error });
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

    const error = req.query.error;

    // Render the subcategories.ejs template with subcategories data
    res.render('admin/subcategories', { subcategories, categoryName, categoryId, error })
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
    const subcategoryID = req.query.SubID;
    const categoryID = req.query.CatID;

    const updatedSubcategoryName = req.body.editSubcategoryName;

    // Validation: Check if subcategoryID and updatedSubcategoryName are provided and not empty
    if (!subcategoryID || !updatedSubcategoryName || updatedSubcategoryName.trim() === "") {
      // return res.status(400).json({ error: 'Subcategory ID and name are required' });
      return res.redirect('/admin/subcategories?error=Subcategory ID and name are required!');
    }

  
    // Validation: Check if the subcategory with the provided subcategoryID exists
    const existingSubcategory = await Subcategory.findById(subcategoryID);
    if (!existingSubcategory) {
      // return res.status(404).json({ error: 'Subcategory not found' });
      return res.redirect('/admin/subcategories?error=Subcategory not found!');
    }

    // Validation: Check if the subcategory name already exists within the category (case-insensitive)
    const isDuplicateSubcategory = await Subcategory.findOne({
      _id: { $ne: subcategoryID }, // Exclude the current subcategory being edited
      subcategoryName: { $regex: new RegExp(`^${updatedSubcategoryName}$`, 'i') }, // Case-insensitive comparison
      category: categoryID,
    });

    if (isDuplicateSubcategory) {
      // return res.status(400).json({ error: 'Subcategory name must be unique within the category' });
      return res.redirect('/admin/subcategories?error=Subcategory name must be unique within the category!');

    }

    // Update the subcategory name
    const updatedSubcategory = await Subcategory.updateOne(
      { _id: subcategoryID },
      { $set: { subcategoryName: updatedSubcategoryName } }
    );

    // Check if no documents were modified during the update
    if (updatedSubcategory.nModified === 0) {
      // return res.status(404).send('Subcategory not found');
      return res.redirect('/admin/subcategories?error=Subcategory not found!');
    }

    // Redirect to the subcategories page within the specified category
    res.redirect(`/admin/subcategories/${categoryID}`);
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



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
      // return res.status(404).json({ message: 'Category not found' });
      return res.redirect('/admin/subcategories?error=Category not found!');
    }

    const categoryName = category.name;

    const subCategoryFind = await Subcategory.findByIdAndUpdate(
      subcategoryID,
      { $set: { isDisabled: false } }
    );

    if (!subCategoryFind) {
      // return res.status(400).json({ message: 'No Subcategory Found' });
      return res.redirect('/admin/subcategories?error=No Subcategory Found!');
    }

    const error = req.query.error;

    res.render('admin/subcategories', { subCategoryFind, categoryID, categoryName, error });
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