const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const session = require('express-session')
const config = require('../config/config')

const userController = require('../controllers/userController')


router.get('/',userController.loginpage)
router.get('/login',userController.loginpage)
router.get('/signup',userController.signupPage)
router.get('/otp',userController.otpPage)
router.get('/forgotpassword',userController.forgotpasswordPage)
router.get('/resetpassword',userController.resetpassword)
router.get('/resend-otp',userController.resendOTP)


router.post('/register',userController.registerUser)
router.post('/verify-otp',userController.verifyOTP)

module.exports = router