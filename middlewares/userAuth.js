const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const { render } = require('ejs')
const bcrypt = require('bcrypt')



// ==================== No Session ============================== //
const noSession = async (req,res,next)=>{
    try {
        if(!req.session.userId){
            return res.redirect('/')
        }

        if (!User.isVerified) {
            // Display a SweetAlert message for a blocked user
            Swal.fire({
                icon: 'error',
                title: 'Account Blocked',
                text: 'Your account has been blocked. Please contact support.',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                // Redirect to the login page
                res.redirect('/login');
            });
            return; // Prevent further execution of the middleware
        }

        return next()
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ======================== Yes Session =========================== //
const yesSession =  async (req ,res,next)=> {
    try {
        if(req.session.userId){
            return res.redirect('/home')
        }
        return next()
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}


module.exports = {
    yesSession,
    noSession
}