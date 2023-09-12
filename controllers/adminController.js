const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')



// ================== Login Page =================== //
const loginPage = async (req,res)=>{
    try {
        res.render('admin/adminLogin')
    } catch (error) {
        res.render('error')
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

const listUsers = async(req,res)=>{
    try {
        const usersList = await User.User.find()
        console.log(usersList)
        res.render('admin/users',{usersList})
    } catch (error) {
        console.error(error);
        res.render('error')
    }
}



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

// =================== Blocked ====================== //
const userBlocked =async (req,res)=>{
    try {
        const userId = req.params.userId
        console.log(userId)
        // const userFind = await User.findByIdAndUpdate(userId,{isVerified:false})
         const userFind = await User.User.findByIdAndUpdate(userId,{$set:{isVerified:false}})
        // const userFind = await User.User.findById(userId)
        console.log(userFind)

        if(!userFind){
            res.status(400).json({ message: 'User not Found' });
        }
        res.redirect('/admin/users')
    } catch (error) {
        console.error(error);
    }
}

const userActive = async (req,res)=>{
    try {
        const userId = req.params.userId
        console.log(userId)
        const userFind = await User.User.findByIdAndUpdate(userId,{$set:{isVerified:true}})

        if(!userFind){
            res.status(400).json({message: 'User not Found'})
        }
        res.redirect('/admin/users')
    } catch (error) {
        console.error(error);
    }
}

const check = async (req,res)=>{
    res.render('admin/newDashboard')
}

module.exports = {
    dashboard,
    loginPage,
    products,
    categories,
    orders,
    listUsers,
    userBlocked,
    userActive,
    check
}