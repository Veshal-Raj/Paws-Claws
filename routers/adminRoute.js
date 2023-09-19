const express = require('express')
const adminRoute = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')


const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const subcategoryController = require('../controllers/subCategories')
const productController = require('../controllers/productController')



adminRoute.get('/',adminController.yesSession,adminController.loginPage)
adminRoute.get('/signout',adminController.signout)
adminRoute.get('/dashboard',adminController.noSession,adminController.dashboard)
adminRoute.get('/users',adminController.noSession,adminController.listUsers)


adminRoute.post('/login',adminController.verifyAdmin)
adminRoute.post('/userBlocked/:userId',adminController.userBlocked)
adminRoute.post('/userActive/:userId',adminController.userActive)


// =========================== Category route ====================== //

adminRoute.get('/categories',adminController.noSession,categoryController.getAllCategories)   // get all categories
adminRoute.post('/categoryAvailable/:categoryId',adminController.noSession,categoryController.categoryAvailable)  // making category Available
adminRoute.post('/categoryNA/:categoryId',adminController.noSession,categoryController.categoryNA) // making category NA
adminRoute.post('/categoryEdit',adminController.noSession,categoryController.categoryEdit) // Editing the category


adminRoute.post('/addCategory',adminController.noSession,categoryController.CreateCategory)  // create a new category


// ============================ sub-category route =========================== //
adminRoute.post('/subcategories/:categoryId',adminController.noSession, subcategoryController.renderSubcategoriesPage); // Render subcategory page
adminRoute.get('/subcategories/:categoryId',adminController.noSession, subcategoryController.renderSubcategoriesPage); // Render subcategory page

adminRoute.get('/subcategories',adminController.noSession, subcategoryController.renderSubcategoriesPage)
adminRoute.post('/subcategories',adminController.noSession, subcategoryController.createSubCategory)  // create a new subcategory
adminRoute.get('/categories/:categoryId/subcategories',adminController.noSession, subcategoryController.getAllCategoriesWithSubcategories);
adminRoute.post('/SubcategoryEdit',adminController.noSession, subcategoryController.subcategoryEdit) // Edit subcategory form route
// adminRoute.post('/subcategoriesAvailable',subcategoryController.subcategoryAvailable) // making subcategories Available
// adminRoute.post('/subcategoriesNA/:subcategoryID', subcategoryController.subcategoryNA);
adminRoute.post('/subcategoriesNA',adminController.noSession, subcategoryController.subcategoryNA);


// adminRoute.post('/subcategoriesNA/:categoryID/:subcategoryID', subcategoryController.subcategoryNA);// making subcategory NA

// adminRoute.post('/subcategoriesNA/:subcategoryID',subcategoryController.subcategoryNA) // making subcategory NA


// =============================== Product route ========================================= //
adminRoute.get('/products',adminController.noSession,productController.renderProductpage)
adminRoute.post('/addproduct',adminController.noSession,productController.addproduct)
adminRoute.post('/productSubcategories',adminController.noSession,productController.fetchSucategories)





module.exports = adminRoute