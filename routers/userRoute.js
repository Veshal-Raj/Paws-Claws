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
const userAddtoWishlist = require('../controllers/userAddtoWishlist')
const userCheckoutpage = require('../controllers/userCheckoutPage')
const userOrders = require('../controllers/userOrders')
const userCats = require('../controllers/userCatsController')
const userDogs = require('../controllers/userDogsController')
const userSearch = require('../controllers/userSearchController')
const userWallet = require('../controllers/userWallet')
const userCoupon = require('../controllers/userCouponController')
const userProfile = require('../controllers/userProfile')


router.get('/', userAuth.yesSession, userHomePageController.showHomepageProducts)
router.get('/login', userAuth.yesSession, userController.loginpage)
router.get('/signup', userAuth.yesSession, userController.signupPage)
router.get('/otp', userAuth.yesSession, userController.otpPage)
router.get('/forgotpassword', userAuth.yesSession, userController.forgotpasswordPage)
router.get('/resetpassword', userAuth.yesSession, userController.resetpassword)
router.get('/resend-otp', userAuth.yesSession, userController.resendOTP)
router.get('/home', userHomePageController.showHomepageProducts)
router.get('/product', userProductController.productSinglePageView);

router.post('/add-review', userProductController.addReview)


router.get('/userBlockedByAdmin', userAuth.userBlockedByAdmin)

router.post('/signout', userController.userSignout)
router.post('/register', userController.registerUser)
router.post('/verify-otp', userController.verifyOTP)
router.post('/forgotpasswordOTP', userController.forgotpasswordOTP)
router.post('/confirmForgotpasswordOTP', userController.confirmforgotpasswordotp)
router.post('/newPasswordUpdate', userController.newPasswordUpdate)



router.post('/login', userController.userlogin)


// ========================= Search bar ================================= //
router.get('/search', userSearch.homePageSearchbar )

// ========================= Add to Cart ================================== //
router.post('/showCart', userAuth.noSession, userAddtoCart.showCart)
router.post('/addToCart/:productId', userAuth.noSession, userAddtoCart.addToCart)
router.put('/updateQuantity/:productId/:newQuantity', userAuth.noSession, userAddtoCart.updateQuantity)

// Delete from cart also in userAddtoCart controller
router.delete('/removeFromCart/:productId', userAuth.noSession, userAddtoCart.removeFromCart)

// =========================== Add to wishlist ============================== //
router.post('/showWishlist', userAuth.noSession, userAddtoWishlist.showWishlist)
router.post('/addToWishlist', userAuth.noSession, userAddtoWishlist.addToWishlist)
router.post('/removeFromWishlist',userAuth.noSession, userAddtoWishlist.removeFromWishlist)

// ============================= User Account ==================================== //
router.get('/account', userAuth.noSession, userProfile.showUserProfile)
router.post('/updateFullName', userAuth.noSession,userProfile.updateFullName)
router.post('/updateEmail', userAuth.noSession, userProfile.updateEmail)
router.post('/updatePhone', userAuth.noSession, userProfile.updatePhone)
router.post('/updatePasssword', userAuth.noSession, userProfile.updatePassword)
router.get('/userAddress', userAuth.noSession, userProfile.userAddress)
router.get('/modifyAddress',userAuth.noSession,userProfile.modifyAddress)
router.put('/updateAddress', userAuth.noSession, userProfile.updateAddress)
router.get('/getAddress', userAuth.noSession, userProfile.getAddress)
router.delete('/deleteAddress',userAuth.noSession, userProfile.deleteAddress)


// ============================= User Wallet ===================================== //

router.get('/wallet', userAuth.noSession, userWallet.wallet)
router.post('/wallet',userAuth.noSession,userCheckoutpage.wallet)

// ========================= Checkout page ================================== //
router.post('/checkout', userAuth.noSession, userCheckoutpage.checkout)

router.post('/saveAddress', userAuth.noSession, userCheckoutpage.saveAddress)

router.post('/proceedToPay', userAuth.noSession, userCheckoutpage.proceedToPay)

router.delete('/deleteOrderAddress/:addressId', userAuth.noSession,userCheckoutpage.deleteOrder)

router.get('/getAddress/:id', userAuth.noSession, userCheckoutpage.getAddress )

router.delete('/deletingAddressWhileEditing/:addressId', userAuth.noSession, userCheckoutpage.deletingAddressWhileEditing) // for deleting the card while i click the edit button

// =========================== Online payment  ============================================ //
router.post('/onlinepayment',userAuth.noSession,userCheckoutpage.onlinePayment)
router.delete('/clearCart', userAuth.noSession, userCheckoutpage.clearCart)

// ========================= Orders ============================ //
router.get('/showOrders', userAuth.noSession, userOrders.showOrders)
// invoice
router.get('/viewInvoice', userAuth.noSession, userOrders.viewInvoice)

// ======================== Cancel Order =========================== //
router.post('/cancelOrder/:orderId',userAuth.noSession,userOrders.cancelOrder)

// ========================= Coupon ============================== //
router.post('/couponUsing', userAuth.noSession, userCoupon.couponUsing) 
// router.post('/couponUsing', async (req,res) => {
//     console.log('chekkingggggg')
// }) 

// router.post('/couponUsing',userAuth.noSession, userController.loginpage)   



// ========================= Cats =================================== //
router.get('/cats', userCats.cats)
router.get('/cats/filter',userCats.filterCatProducts)


// ========================= Dogs =================================== //
router.get('/dogs', userDogs.dogs)
router.get('/dogs/filter',userDogs.filterDogProducts)

router.get('/error', async (req, res) => {
    res.render('error')
})
router.get('/something', async (req, res) => {
    res.render('somethingwentwrong')
})

module.exports = router