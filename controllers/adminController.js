const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// ================== Render Login Page =================== //
const loginPage = async (req, res) => {
    try {
        res.render('admin/adminLogin')
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ================== Render Dashboard ==================== //
const dashboard = async (req, res) => {
    try {
        res.render('admin/dashboard')

    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ==================== Render and ListUsers =================== //
const listUsers = async (req, res) => {
    try {
        const usersList = await User.User.find()

        res.render('admin/users', { usersList })
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}


// ==================== Verify Admin ===================== //
const verifyAdmin = async (req, res) => {
    try {
        // Find a user with the provided email
        const { email, password } = req.body;

        const user = await User.User.findOne({ email })

        if (!user) {
            return res.render('admin/adminLogin', { alert: 'Invalid Credentials' })
        }

        // Compare the entered password  with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.render('admin/adminLogin', { alert: 'Invalid Credentials' })

        }

        // Send a sucess response or token
        if (user.role === 'Admin') {

            // session 
            req.session.userId = user._id
            res.redirect('/admin/dashboard')

        } else {
            res.status(400).json({ message: 'not an Admin' })
        }

    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// =================== Blocked User ======================= //
const userBlocked = async (req, res) => {
    try {
        const userId = req.params.userId

        const userFind = await User.User.findByIdAndUpdate(userId, { $set: { isVerified: false } })

        if (!userFind) {
            res.status(400).json({ message: 'User not Found' });
        }
        res.redirect('/admin/users')
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// =================== ACtivate User ====================== //
const userActive = async (req, res) => {
    try {
        const userId = req.params.userId

        const userFind = await User.User.findByIdAndUpdate(userId, { $set: { isVerified: true } })

        if (!userFind) {
            res.status(400).json({ message: 'User not Found' })
        }
        res.redirect('/admin/users')
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ==================== Admin Logout ====================== //
const signout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}


module.exports = {
    dashboard,
    loginPage,
    listUsers,
    userBlocked,
    userActive,
    verifyAdmin,
    signout
}