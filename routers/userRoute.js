const express = require('express')
const router = express.Router()




router.get('/',(req,res)=>{
    res.render('users/login',{url:req.protocol+"://"+req.headers.host})
})

router.get('/login',(req,res)=>{
    res.render('users/login',{url:req.protocol+"://"+req.headers.host})
})

router.get('/signup',(req,res)=>{
    res.render('users/signup',{url:req.protocol+"://"+req.headers.host})
})

router.get('/otp',(req,res)=>{
    res.render('users/otp',{url:req.protocol+"://"+req.headers.host})
})


module.exports = router