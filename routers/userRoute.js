const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const session = require('express-session')
const config = require('../config/config')

const userController = require('../controllers/userController')
const userHomePageController = require('../controllers/userHomePageController')
const userProductController = require('../controllers/userProductController')

router.get('/',userController.yesSession,userController.loginpage)
router.get('/login',userController.yesSession,userController.loginpage)
router.get('/signup',userController.yesSession,userController.signupPage)
router.get('/otp',userController.otpPage)
router.get('/forgotpassword',userController.forgotpasswordPage)
router.get('/resetpassword',userController.resetpassword)
router.get('/resend-otp',userController.resendOTP)
router.get('/home',userController.noSession,userHomePageController.showHomepageProducts)

// router.post('/product/',userProductController.productSinglePageView)
router.get('/product',userController.noSession, userProductController.productSinglePageView);




router.post('/signout',userController.userSignout)
router.post('/register',userController.registerUser)
router.post('/verify-otp',userController.verifyOTP)
router.post('/login',userController.userlogin)

module.exports = router