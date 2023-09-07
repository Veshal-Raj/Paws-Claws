const express = require('express')
const router = express.Router()


const userController = require('../controllers/userController')


router.get('/',userController.loginpage)
router.get('/login',userController.loginpage)
router.get('/signup',userController.signupPage)
router.get('/otp',userController.otpPage)
router.get('/forgotpassword',userController.forgotpasswordPage)
router.get('/resetpassword',userController.resetpassword)


router.post('/register',userController.registerUser)

module.exports = router