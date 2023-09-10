const express = require('express')
const adminRoute = express.Router()
const bodyParser = require('body-parser')
const session = require('express-session')


const adminController = require('../controllers/adminController')

adminRoute.get('/',adminController.loginPage)
adminRoute.get('/dashboard',adminController.dashboard)
adminRoute.get('/users',adminController.users)
adminRoute.get('/orders',adminController.orders)
adminRoute.get('/categories',adminController.categories)
adminRoute.get('/products',adminController.products)


module.exports = adminRoute