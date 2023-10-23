const Category = require('../models/categoriesModel')

// ===================== Create a new category ================================== //
const CreateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        // Validation: Check if categoryName is provided and not empty
        if (!categoryName || categoryName.trim() === "") {
            return res.status(400).json({ error: 'Category name is required' });
        }

        // Check if a category with the exact name (case-insensitive) already exists
        const existingCategory = await Category.Category.findOne({
            categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') }, // Case-insensitive comparison
        });

        if (existingCategory) {
            
            return res.redirect('/admin/categories?error=Category name already exists!');
           
        }

        // Create a new category
        const category = new Category.Category({ categoryName });

        const savedCategory = await category.save();

        res.redirect('/admin/categories');
    } catch (error) {
        res.render('error');
        console.error(error);
    }
};



// ==================== Get all categories ====================================== //
const getAllCategories = async (req, res) => {
    try {
        // Fetch all categories from the database and populate their subcategories
        const categories = await Category.Category.find().populate('subcategories');

        const error = req.query.error;

        // Render the 'admin/category' page with the retrieved categories data
        res.render('admin/category', { categories, error });
    } catch (error) {
        // Handle any errors, log them, and render an error page
        console.error(error);
        res.render('error');
    }
};



// =================== Making Category Available ================================== //
const categoryAvailable = async (req, res) => {
    try {
        // Extract the category ID from the URL parameters
        const categoryId = req.params.categoryId;

        // Update the category to set it as available (not disabled)
        const category = await Category.Category.findByIdAndUpdate(categoryId, { isDisabled: false });

        // Check if the category was not found
        if (!category) {
           
            return res.redirect('/admin/categories?error=Category not found!');
        }

        // Redirect to the admin categories page after successful update
        res.redirect('/admin/categories');
    } catch (error) {
        // Handle any errors and render an error page
        console.error(error);
        res.render('error');
    }
};


// ====================== Making Category Not-Available ============================= //
const categoryNA = async (req, res) => {
    try {
        // Extract the category ID from the URL parameters
        const categoryId = req.params.categoryId;

        // Update the category to set it as disabled
        const category = await Category.Category.findByIdAndUpdate(categoryId, { isDisabled: true });

        // Check if the category was not found
        if (!category) {
            
            return res.redirect('/admin/categories?error=Category not found!');
        }

        // Redirect to the admin categories page after successful update
        res.redirect('/admin/categories');
    } catch (error) {
        // Handle any errors and render an error page
        console.error(error);
        res.render('error');
    }
};


// ======================= Editing Category ========================================== //
const categoryEdit = async (req, res) => {
    try {
        // Extract the category ID from the URL query parameter
        const categoryId = req.query.CatID;
        
        // Extract the updated category name from the request body
        const updatedCategoryName = req.body.editCategoryName;

        // Validation: Check if categoryId and updatedCategoryName are provided and not empty
        if (!categoryId || !updatedCategoryName || updatedCategoryName.trim() === "") {
            return res.redirect('/admin/categories?error=Category ID and name are required!');
        }
  
        // Validation: Check if the category with the provided categoryId exists (case-insensitive)
        const existingCategory = await Category.Category.findOne({
            _id: { $ne: categoryId }, // Exclude the current category being edited
            categoryName: new RegExp(`^${updatedCategoryName}$`, 'i'), // Case-insensitive comparison
        });

        if (existingCategory) {
    
            return res.redirect('/admin/categories?error=Category name already exists!');
        }

        // Update the category with the new name
        const updatedCategory = await Category.Category.updateOne(
            { _id: categoryId }, // Filter by category ID
            { categoryName: updatedCategoryName } // Set the new category name
        );

        // Check if no documents were modified during the update
        if (updatedCategory.nModified === 0) {
            // If no documents were modified, it means the category was not found.
          
            return res.redirect('/admin/categories?error=Category not found!');
        }

        // Redirect to the admin categories page after a successful update
        res.redirect('/admin/categories');
    } catch (error) {
        // Handle any errors and render an error page
        console.error(error);
        res.render('error');
    }
};




// ======================  Get a Single Category ==================================== //
const getCategoryById = async (req, res) => {
    try {
        // Extract the category ID from the URL parameters
        const categoryId = req.params.categoryId;

        // Find the category by its ID
        const category = await Category.Category.findById(categoryId);

        // Check if the category was not found
        if (!category) {
            return res.redirect('/admin/categories?error=Category not found!');
        }

        // Respond with the found category
        res.status(200).json(category);
    } catch (error) {
        // Handle any errors and render an error page
        console.error(error);
        res.render('error');
    }
};


module.exports = {
    CreateCategory,
    getAllCategories,
    getCategoryById,
    categoryAvailable,
    categoryNA,
    categoryEdit
}