const express = require('express')
const adminRoute = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')


const adminController = require('../controllers/adminController')

adminRoute.get('/',adminController.loginPage)
adminRoute.get('/dashboard',adminController.dashboard)
// adminRoute.get('/users',adminController.users)
adminRoute.get('/orders',adminController.orders)
adminRoute.get('/categories',adminController.categories)
adminRoute.get('/products',adminController.products)
adminRoute.get('/users',adminController.listUsers)
adminRoute.get('/category',adminController.listCategory)
//adminRoute.get('/userBlocked/:userId',adminController.userBlocked)

adminRoute.get('/check',adminController.check)
adminRoute.get('/table',(req,res)=>{
    res.render('admin/form-elements.ejs')
})

adminRoute.post('/login',adminController.verifyAdmin)
adminRoute.post('/userBlocked/:userId',adminController.userBlocked)
adminRoute.post('/userActive/:userId',adminController.userActive)



module.exports = adminRoute