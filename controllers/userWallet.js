const User = require('../models/userModel')


const wallet = async (req,res) => {
    try {
        const userId = req.session.userId

        const user = await User.User.findById(userId)

        // Extract wallet details from the user object
        const walletDetails = user.wallet;

        res.render('users/wallet',{userId,user,walletDetails})
        
    } catch (error) {
        
    }
}

module.exports = {
    wallet
}