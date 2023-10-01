const User = require('../models/userModel')


const checkout = async (req,res) => {
    try {
        const userId = req.session.userId

        // Fetch the user data with the populated 'address' field
        const user = await User.User.findById(userId).populate('address');

        res.render('users/checkoutpage',{userId,user})
    } catch (error) {
        console.error(error)
        res.render('error')
    }
}

const saveAddress = async (req,res) => {
    try {
        const formData = req.body
        console.log(formData)

        const userId = req.session.userId

        // Find the user by ID
        const user = await User.User.findById(userId)

        if (!user) {
            return res.status(404).json({error: 'User not found '})
        }

        // Create an address object
        const newAddress = {
            fullname: formData.firstName + ' '+formData.lastName,
            first_address: formData.address,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            pincode:formData.pincode,
            landmark:formData.landmark,
            mobileNumber:formData.mobileNumber
        }

        // Push the new address to the address array
        user.address.push(newAddress)

        // Save the user document with the updated address
        await user.save()

        // Address added successfully
        return res.status(200).json({message:'Address added successfully', newAddress})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const proceedToPay = async(req,res) => {
    try {
        const { selectedAddress } = req.body

        res.json({ status: 'success', message: 'Payment successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal Server Error'})
    }
}
module.exports ={
    checkout,
    saveAddress,
    proceedToPay
}