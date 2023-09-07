const User = require('../models/userModel')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')

// ======================== Render user login page ======================= //
const loginpage = async (req,res)=>{
    try {
        res.render('users/login',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

// ======================== Render signup page ============================ //
const signupPage =async (req,res)=>{
    try {
        res.render('users/signup',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

// ========================= Register User ================================= //
const registerUser=  async (req,res)=>{
    try {
        const { fullname, email, phone, password } = req.body
        fullname = fullname.trim()
        email = email.trim()
        phone = phone.trim()
        password = password.trim()
        if(fullname == "" || email == "" || phone == "" || password == ""){
            res.json({
                status: "FAILED",
                message: "Empty input fileds!"
            })
        }
        const user = new User({ fullname, email, phone, password})
        await user.save()
        res.status(201).send('User registered successfully')
    } catch (error) {
        res.status(400).send('Registration failed')
    }
}

// ======================== Render OTP page ================================ //
const otpPage =async (req,res)=>{
    try {
        res.render('users/otp',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

// ========================= Render Forgot Password Page ==================== //
const forgotpasswordPage = async (req,res)=>{
    try {
        res.render('users/forgotpassword',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}


// ========================== Render Reset Password Page ====================== //
const resetpassword= async (req,res)=>{
    try {
        res.render('users/resetPassword',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

module.exports={
    loginpage,
    signupPage,
    otpPage,
    forgotpasswordPage,
    resetpassword,
    registerUser
}