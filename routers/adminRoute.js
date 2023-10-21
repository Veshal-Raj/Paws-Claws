const express = require('express')
const adminRoute = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')
const multer = require('multer')
const path = require('path')

// Define storage and upload settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads"),
            function (error, success) {
                if (error) {
                    console.error("Error in file uploading", error)
                }

            })
    },
    filename: function (req, file, cb) {
        const name = Date.now() + "-" + file.originalname
        cb(null, name, function (error, success) {
            if (error) {
                console.error(error)
            }
        })
    }
})

const upload = multer({ storage: storage })



const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const subcategoryController = require('../controllers/subCategories')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const adminAuth = require('../middlewares/adminAuth')
const couponController = require('../controllers/couponController')
const bannerController = require('../controllers/bannerController')
const dashboardController = require('../controllers/adminDashboard')




adminRoute.get('/', adminAuth.yesSession, adminController.loginPage)
adminRoute.get('/signout', adminController.signout)
// adminRoute.get('/dashboard', adminAuth.noSession, adminController.dashboard)
adminRoute.get('/users', adminAuth.noSession, adminController.listUsers)

// ======================= dashboard =============================== //
adminRoute.get('/dashboard', adminAuth.noSession, dashboardController.dashboard)
adminRoute.get('/ChartPaymentMethod',adminAuth.noSession,dashboardController.ChartPaymentMethod)
adminRoute.get('/ChartRevenueBasedOnMonth',adminAuth.noSession, dashboardController.ChartRevenueBasedOnMonth)

// Sales report
adminRoute.get('/salesreport',adminAuth.noSession, dashboardController.salesreport)
// adminRoute.get('/sales-report',adminAuth.noSession, dashboardController.salesreport)

// ====================
adminRoute.post('/login', adminController.verifyAdmin)
adminRoute.post('/userBlocked/:userId', adminController.userBlocked)
adminRoute.post('/userActive/:userId', adminController.userActive)


// =========================== Category route ====================== //

adminRoute.get('/categories', adminAuth.noSession, categoryController.getAllCategories)   // get all categories
adminRoute.post('/categoryAvailable/:categoryId', adminAuth.noSession, categoryController.categoryAvailable)  // making category Available
adminRoute.post('/categoryNA/:categoryId', adminAuth.noSession, categoryController.categoryNA) // making category NA
adminRoute.post('/categoryEdit', adminAuth.noSession, categoryController.categoryEdit) // Editing the category


adminRoute.post('/addCategory', adminAuth.noSession, categoryController.CreateCategory)  // create a new category


// ============================ sub-category route =========================== //
adminRoute.post('/subcategories/:categoryId', adminAuth.noSession, subcategoryController.renderSubcategoriesPage); // Render subcategory page
adminRoute.get('/subcategories/:categoryId', adminAuth.noSession, subcategoryController.renderSubcategoriesPage); // Render subcategory page

adminRoute.get('/subcategories', adminAuth.noSession, subcategoryController.renderSubcategoriesPage)
adminRoute.post('/subcategories', adminAuth.noSession, subcategoryController.createSubCategory)  // create a new subcategory
adminRoute.get('/categories/:categoryId/subcategories', adminAuth.noSession, subcategoryController.getAllCategoriesWithSubcategories);
adminRoute.post('/SubcategoryEdit', adminAuth.noSession, subcategoryController.subcategoryEdit) // Edit subcategory form route
// adminRoute.post('/subcategoriesAvailable',subcategoryController.subcategoryAvailable) // making subcategories Available
// adminRoute.post('/subcategoriesNA/:subcategoryID', subcategoryController.subcategoryNA);
adminRoute.post('/subcategoriesNA', adminAuth.noSession, subcategoryController.subcategoryNA);


// adminRoute.post('/subcategoriesNA/:categoryID/:subcategoryID', subcategoryController.subcategoryNA);// making subcategory NA

// adminRoute.post('/subcategoriesNA/:subcategoryID',subcategoryController.subcategoryNA) // making subcategory NA


// =============================== Product route ========================================= //
adminRoute.get('/products', adminAuth.noSession, productController.renderProductpage)
adminRoute.post('/addproduct', adminAuth.noSession, upload.array('productImages', 6), productController.addproduct)
adminRoute.post('/productSubcategories', adminAuth.noSession, productController.fetchSucategories)
adminRoute.post('/update-availability', adminAuth.noSession, productController.productAvailability);

adminRoute.post('/getSubcategories', adminAuth.noSession, productController.getSubcategories)
adminRoute.post('/loadSubcategories', adminAuth.noSession, productController.getSubcategories)

adminRoute.post('/deleteImage', adminAuth.noSession, productController.deleteImage)

adminRoute.post('/editproduct/:productId', adminAuth.noSession, upload.any(), productController.editproductsave)


// ============================ Order route ========================================== //
adminRoute.get('/orders',adminAuth.noSession,orderController.showOrders)
adminRoute.post('/updateOrderStatus',adminAuth.noSession,orderController.updateOrderStatus)

adminRoute.post('/cancelOrder',adminAuth.noSession, orderController.cancelOrder)


// ======================== Coupon route ====================================== //
adminRoute.get('/Offer',adminAuth.noSession,couponController.showCoupons )
adminRoute.post('/createCoupon',adminAuth.noSession, couponController.createCoupon)

adminRoute.get('/getCoupon/:couponId',adminAuth.noSession,couponController.getCoupon)
adminRoute.post('/updateCouponStatus/:couponId', adminAuth.noSession,couponController.updateCouponStatus)


// =========================== Banner route ==================================== //
adminRoute.get('/banner', adminAuth.noSession, bannerController.showBanner)
adminRoute.post('/saveBanner',adminAuth.noSession,upload.single('bannerImage'),bannerController.saveBanner)
adminRoute.delete('/deleteBanner/:bannerId',adminAuth.noSession,bannerController.deleteBanner)

module.exports = adminRoute