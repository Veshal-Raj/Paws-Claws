const User = require('../models/userModel')


const wallet = async (req, res) => {
    try {
        const userId = req.session.userId;

        // Find the user by ID and project the wallet details
        const user = await User.User.findById(userId, 'wallet').lean();

        if (!user) {
            console.error('User not found');
            return res.render('error'); // Handle user not found error
        }

        const walletDetails = user.wallet;

        res.render('users/wallet', { userId, user, walletDetails });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
}


module.exports = {
    wallet
}