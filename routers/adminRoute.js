const express = require('express')
const adminRoute = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')


const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const subcategoryController = require('../controllers/subCategories')



adminRoute.get('/',adminController.loginPage)
adminRoute.get('/dashboard',adminController.dashboard)
adminRoute.get('/users',adminController.listUsers)


adminRoute.post('/login',adminController.verifyAdmin)
adminRoute.post('/userBlocked/:userId',adminController.userBlocked)
adminRoute.post('/userActive/:userId',adminController.userActive)


// =========================== Category route ====================== //

adminRoute.get('/categories',categoryController.getAllCategories)   // get all categories
adminRoute.post('/categoryAvailable/:categoryId',categoryController.categoryAvailable)  // making category Available
adminRoute.post('/categoryNA/:categoryId',categoryController.categoryNA) // making category NA
// adminRoute.post('/categoryEdit/:categoryId',categoryController.categoryEdit) // Editing the category
adminRoute.post('/categoryEdit',categoryController.categoryEdit) // Editing the category


adminRoute.post('/addCategory',categoryController.CreateCategory)  // create a new category


// ============================ sub-category route =========================== //
// adminRoute.get('/subcategories/:categoryId',subcategoryController.getSubCategoriesByCategory)  // get all subcategories for a specific category
adminRoute.post('/subcategories',subcategoryController.createSubCategory)  // create a new subcategory
adminRoute.get('/categories/:categoryId/subcategories', subcategoryController.getAllCategoriesWithSubcategories);



module.exports = adminRoute