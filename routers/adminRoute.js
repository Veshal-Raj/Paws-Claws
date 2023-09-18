const express = require('express')
const adminRoute = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')


const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const subcategoryController = require('../controllers/subCategories')
const productController = require('../controllers/productController')



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
adminRoute.post('/categoryEdit',categoryController.categoryEdit) // Editing the category


adminRoute.post('/addCategory',categoryController.CreateCategory)  // create a new category


// ============================ sub-category route =========================== //
adminRoute.post('/subcategories/:categoryId', subcategoryController.renderSubcategoriesPage); // Render subcategory page
adminRoute.get('/subcategories/:categoryId', subcategoryController.renderSubcategoriesPage); // Render subcategory page

adminRoute.get('/subcategories',subcategoryController.renderSubcategoriesPage)
adminRoute.post('/subcategories',subcategoryController.createSubCategory)  // create a new subcategory
adminRoute.get('/categories/:categoryId/subcategories', subcategoryController.getAllCategoriesWithSubcategories);
adminRoute.post('/SubcategoryEdit',subcategoryController.subcategoryEdit) // Edit subcategory form route
// adminRoute.post('/subcategoriesAvailable',subcategoryController.subcategoryAvailable) // making subcategories Available
// adminRoute.post('/subcategoriesNA/:subcategoryID', subcategoryController.subcategoryNA);
adminRoute.post('/subcategoriesNA', subcategoryController.subcategoryNA);


// adminRoute.post('/subcategoriesNA/:categoryID/:subcategoryID', subcategoryController.subcategoryNA);// making subcategory NA

// adminRoute.post('/subcategoriesNA/:subcategoryID',subcategoryController.subcategoryNA) // making subcategory NA


// =============================== Product route ========================================= //
adminRoute.get('/products',productController.renderProductpage)
adminRoute.post('/addproduct',productController.addproduct)



module.exports = adminRoute