const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const session = require('express-session')
const config = require('../config/config')

const userController = require('../controllers/userController')
const userHomePageController = require('../controllers/userHomePageController')
const userProductController = require('../controllers/userProductController')
const userAuth = require('../middlewares/userAuth')


router.get('/',userAuth.yesSession,userController.loginpage)
router.get('/login',userAuth.yesSession,userController.loginpage)
router.get('/signup',userAuth.yesSession,userController.signupPage)
router.get('/otp',userController.otpPage)
router.get('/forgotpassword',userController.forgotpasswordPage)
router.get('/resetpassword',userController.resetpassword)
router.get('/resend-otp',userController.resendOTP)
router.get('/home',userAuth.noSession,userHomePageController.showHomepageProducts)
router.get('/product',userAuth.noSession, userProductController.productSinglePageView);





router.post('/signout',userController.userSignout)
router.post('/register',userController.registerUser)
router.post('/verify-otp',userController.verifyOTP)
router.post('/login',userController.userlogin)

module.exports = router