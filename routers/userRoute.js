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


module.exports = router