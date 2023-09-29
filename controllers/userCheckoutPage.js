const User = require('../models/userModel')


const checkout = async (req,res) => {
    try {
        res.render('users/checkoutpage',{userId:req.session.userId})
    } catch (error) {
        console.error(error)
        res.render('error')
    }
}

module.exports ={
    checkout
}