const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const session = require('express-session')
const config = require('../config/config')

const userController = require('../controllers/userController')
const userHomePageController = require('../controllers/userHomePageController')
const userProductController = require('../controllers/userProductController')
const userAuth = require('../middlewares/userAuth')
const userAddtoCart = require('../controllers/userAddtoCart')
const userCheckoutpage = require('../controllers/userCheckoutPage')


router.get('/',userAuth.yesSession,userHomePageController.showHomepageProducts)
router.get('/login',userAuth.yesSession,userController.loginpage)
router.get('/signup',userAuth.yesSession,userController.signupPage)
router.get('/otp',userAuth.yesSession,userController.otpPage)
router.get('/forgotpassword',userAuth.yesSession,userController.forgotpasswordPage)
router.get('/resetpassword',userAuth.yesSession,userController.resetpassword)
router.get('/resend-otp',userAuth.yesSession,userController.resendOTP)
router.get('/home',userHomePageController.showHomepageProducts)
router.get('/product', userProductController.productSinglePageView);



router.get('/userBlockedByAdmin',userAuth.userBlockedByAdmin)

router.post('/signout',userController.userSignout)
router.post('/register',userController.registerUser)
router.post('/verify-otp',userController.verifyOTP)
router.post('/forgotpasswordOTP',userController.forgotpasswordOTP)
router.post('/confirmForgotpasswordOTP',userController.confirmforgotpasswordotp)
router.post('/newPasswordUpdate',userController.newPasswordUpdate)



router.post('/login',userController.userlogin)


// ========================= Add to Cart ================================== //
router.post('/showCart',userAuth.noSession,userAddtoCart.showCart)
router.post('/addToCart/:productId',userAuth.noSession,userAddtoCart.addToCart)
router.put('/updateQuantity/:productId/:newQuantity', userAuth.noSession,userAddtoCart.updateQuantity)

// Delete from cart also in userAddtoCart controller
router.delete('/removeFromCart/:productId',userAuth.noSession,userAddtoCart.removeFromCart)


// ========================= Checkout page ================================== //
router.post('/checkout',userAuth.noSession,userCheckoutpage.checkout)

router.post('/saveAddress',userAuth.noSession,userCheckoutpage.saveAddress)

router.post('/check',async(req,res)=>{
    res.send("working")
})

module.exports = router