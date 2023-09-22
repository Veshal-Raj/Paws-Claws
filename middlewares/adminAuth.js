const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')



// =================== No Session ========================= //
const noSession = async (req,res,next)=>{
    try {
        if(!req.session.userId) {
            return res.redirect('/admin')
        }
        return next()
    } catch (error) {
        console.error(error)
        res.render('error')
    }
}

// ====================== Yes Session ====================== //
const yesSession = async(req,res,next) =>{
    try {
        if(req.session.userId) {
            return res.redirect('/dashboard')
        }
        return next()
    } catch (error) {
        console.error(error)
        res.render('error')
    }
}


module.exports = {
    noSession,
    yesSession
}