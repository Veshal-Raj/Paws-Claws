const User = require('../models/userModel')
// const bcrypt = require('bcrypt')



// ================== Login Page =================== //
const loginPage = async (req,res)=>{
    try {
        res.render('admin/adminLogin',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        res.render('error',{url:req.protocol+"://"+req.headers.host})
        console.error(error);
    }
}

// ================== Dashboard ==================== //
const dashboard = async (req,res)=>{
    try {
       const userData = await User.find({isVerified:false})
       console.log(userData) 
       res.render('admin/dashboard',{url:req.protocol+"://"+req.headers.host, users: userData,})
        
    } catch (error) {
        res.render('error',{url:req.protocol+"://"+req.headers.host})
        console.error(error);
    }
}

// =================== users ====================== //
const users = async (req,res)=>{
    try {
        const userData = await User.find({isVerified:false})
        console.log(userData) 
        res.render('admin/users',{url:req.protocol+"://"+req.headers.host, users: userData,})
         
     } catch (error) {
         res.render('error',{url:req.protocol+"://"+req.headers.host})
         console.error(error);
     }
}
// const sidebar = async (req,res)=>{
//     res.render('admin/sidebar',{url:req.protocol+"://"+req.headers.host})
// }

// ==================== products ================== //
const products = async (req,res)=>{
    try {
        res.send("Products")
    } catch (error) {
        console.error(error);
    }
}

// ===================== categories ================= //
const categories = async (req,res)=>{
    try {
        res.send("categories")
    } catch (error) {
        console.error(error);
    }
}

// ===================== orders ==================== //
const orders = async (req,res) =>{
    try {
        res.send("orders")
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    dashboard,
    loginPage,
    users,
    products,
    categories,
    orders
}