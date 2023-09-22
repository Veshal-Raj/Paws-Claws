const express = require('express')
const adminRoute = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')
const multer = require('multer')
const path = require('path')

// Define storage and upload settings
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,path.join(__dirname,"../public/uploads"),
        function(error,success) {
            if(error) {
                console.log("Error in file uploading",error)
            }
            
        }) 
    },
    filename: function (req,file,cb) {
        const name = Date.now() + "-" + file.originalname
        cb(null,name,function(error,success) {
            if (error) {
                console.log(error)
            }
        }) 
    }
})

const upload = multer({storage:storage})



const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const subcategoryController = require('../controllers/subCategories')
const productController = require('../controllers/productController')
const adminAuth = require('../middlewares/adminAuth')




adminRoute.get('/',adminAuth.yesSession,adminController.loginPage)
adminRoute.get('/signout',adminController.signout)
adminRoute.get('/dashboard',adminAuth.noSession,adminController.dashboard)
adminRoute.get('/users',adminAuth.noSession,adminController.listUsers)



adminRoute.post('/login',adminController.verifyAdmin)
adminRoute.post('/userBlocked/:userId',adminController.userBlocked)
adminRoute.post('/userActive/:userId',adminController.userActive)


// =========================== Category route ====================== //

adminRoute.get('/categories',adminAuth.noSession,categoryController.getAllCategories)   // get all categories
adminRoute.post('/categoryAvailable/:categoryId',adminAuth.noSession,categoryController.categoryAvailable)  // making category Available
adminRoute.post('/categoryNA/:categoryId',adminAuth.noSession,categoryController.categoryNA) // making category NA
adminRoute.post('/categoryEdit',adminAuth.noSession,categoryController.categoryEdit) // Editing the category


adminRoute.post('/addCategory',adminAuth.noSession,categoryController.CreateCategory)  // create a new category


// ============================ sub-category route =========================== //
adminRoute.post('/subcategories/:categoryId',adminAuth.noSession, subcategoryController.renderSubcategoriesPage); // Render subcategory page
adminRoute.get('/subcategories/:categoryId',adminAuth.noSession, subcategoryController.renderSubcategoriesPage); // Render subcategory page

adminRoute.get('/subcategories',adminAuth.noSession, subcategoryController.renderSubcategoriesPage)
adminRoute.post('/subcategories',adminAuth.noSession, subcategoryController.createSubCategory)  // create a new subcategory
adminRoute.get('/categories/:categoryId/subcategories',adminAuth.noSession, subcategoryController.getAllCategoriesWithSubcategories);
adminRoute.post('/SubcategoryEdit',adminAuth.noSession, subcategoryController.subcategoryEdit) // Edit subcategory form route
// adminRoute.post('/subcategoriesAvailable',subcategoryController.subcategoryAvailable) // making subcategories Available
// adminRoute.post('/subcategoriesNA/:subcategoryID', subcategoryController.subcategoryNA);
adminRoute.post('/subcategoriesNA',adminAuth.noSession, subcategoryController.subcategoryNA);


// adminRoute.post('/subcategoriesNA/:categoryID/:subcategoryID', subcategoryController.subcategoryNA);// making subcategory NA

// adminRoute.post('/subcategoriesNA/:subcategoryID',subcategoryController.subcategoryNA) // making subcategory NA


// =============================== Product route ========================================= //
adminRoute.get('/products',adminAuth.noSession,productController.renderProductpage)
adminRoute.post('/addproduct',adminAuth.noSession,upload.array('productImages',6),productController.addproduct)
adminRoute.post('/productSubcategories',adminAuth.noSession,productController.fetchSucategories)
adminRoute.post('/update-availability', adminAuth.noSession, productController.productAvailability);





module.exports = adminRoute