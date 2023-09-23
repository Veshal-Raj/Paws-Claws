const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const { render } = require('ejs')
// const bcrypt = require('bcrypt')



// ==================== No Session ============================== //
const noSession = async (req, res, next) => {
    
    try {
        if (!req.session.userId) {
            return res.redirect('/')
        }

        // Fetch the user from the database based on req.session.userId
        const user = await User.User.findById(req.session.userId);

        if (!user || !user.isVerified) {
            // If the user doesn't exist or is not verified, set userIsBlocked to true
            res.locals.userIsBlocked = true;
        } else {
            // Otherwise, set userIsBlocked to false
            res.locals.userIsBlocked = false;
        }
        return next()
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ======================== Yes Session =========================== //
const yesSession = async (req, res, next) => {
    try {
        if (req.session.userId) {
            return res.redirect('/home')
        }
        return next()
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ===================== if user is blocked ======================== //
const userBlockedByAdmin = async (req, res, next) => {

    try {

        // Destroy the user's session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.render('error');
            }
            // Redirect to the login page or any other appropriate action
            res.redirect('/login');
        });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
}

module.exports = {
    yesSession,
    noSession,
    userBlockedByAdmin
}