const express = require('express')
const adminRoute = express.Router()

adminRoute.get('/',(req,res)=>{
    res.render('admin/adminLogin',{url:req.protocol+"://"+req.headers.host})
})

module.exports = adminRoute