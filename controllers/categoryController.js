const Category = require('../models/categoriesModel')

// Create a new category
const CreateCategory = async (req,res)=>{
    try {
        const { categoryName } = req.body
        const category = new Category.Category({categoryName})
        const savedCategory = await category.save()
        res.redirect('/admin/categories')
    } catch (error) {
        res.status(500).json({ error:'Internal Server Error! '})
        console.error(error);
    }
}

// Get all categories
const getAllCategories = async (req,res)=>{
    try {
        const categories = await Category.Category.find()
        console.log(categories)
        res.render('admin/category',{categories})

    } catch (error) {
        res.status(500).json({ error:'Internal Server Error! '})
        console.error(error);
    }
}

// Making Category Available
const categoryAvailable = async  (req ,res )=>{
    try {
        const categoryId = req.params.categoryId
        console.log(categoryId)
        const categoryFind = await Category.Category.findByIdAndUpdate(categoryId,{$set:{isDisabled:false}})
        console.log("updated data is",categoryFind)
        if(!categoryFind){
            res.status(400).json({message: 'Category not Found'})
        }
        res.redirect('/admin/categories')
    } catch (error) {
        console.error(error);
    }
}

// Making Category Not-Available
const categoryNA = async (req,res) =>{
    try {
        const categoryId = req.params.categoryId
        console.log("checking category id",categoryId)
        const categoryFind = await Category.Category.findByIdAndUpdate(categoryId,{$set:{isDisabled:true}}) 
        console.log("updated data is ",categoryFind)
        if(!categoryFind) {
            res.status(400).json({ message: 'Category not found'})
        }
        res.redirect('/admin/categories')
    } catch (error) {
        console.error(error);
    }
}

// Editing Category
const categoryEdit =async (req,res)=>{
    try {
        const categoryId = req.query.CatID // Extract the category ID from the URL
        console.log("category id",categoryId)
        const updatedCategoryName = req.body.editCategoryName // Extract the updated category data from the reques body
        console.log("updatedCategoryName",updatedCategoryName)
        // const updatedCategory = await Category.Category.findByIdAndUpdate(
        //     categoryId,
        //     { name: updatedCategoryName },
        //     { new: true }
        // )

        const updatedCategory = await Category.Category.updateOne({_id:categoryId},{$set:{categoryName:updatedCategoryName}})

        if(!updatedCategory) {
            return res.status(404).send('Category not found')
        }

        res.redirect('/admin/categories')
        // res.send('Category name updated successfully')

    } catch (error) {
        console.error(error);
    }
}

// Get a Single Category
const getCategoryById = async (req,res)=>{
    try {
        const category = await Category.Category.findById(req.params.categoryId)
        if(!category){
            return res.status(404).json({error:'Category not found'})
        }
        res.status(201).json(category)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Sever Error!'})
    }
}

module.exports ={
    CreateCategory,
    getAllCategories,
    getCategoryById,
    categoryAvailable,
    categoryNA,
    categoryEdit
}