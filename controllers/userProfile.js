const User = require('../models/userModel')
const Order = require('../models/ordersModel')
const bcrypt = require('bcrypt')

const showUserProfile = async (req,res) => {
    try {
        const userId = req.session.userId
        console.log(userId)
        const user = await User.User.findById(userId)
        console.log('user details ',user)
        const userCartQuantity = await User.User.findById(userId);
        
           let cartQuantity
        if (userCartQuantity){
            cartQuantity = userCartQuantity.cart.length;

        }

        // const orders = await Order.findById({customer:userId})
        // console.log(orders)

        const orders = await Order.find({ customer: userId })
        console.log('orders',orders.length)
        const numberOfOrders = orders.length


        res.render('users/account',{ userId,user,cartQuantity, orders, numberOfOrders})
    } catch (error) {
        
    }
}

const updateFullName = async (req,res) => {
    try {
        console.log('reached')
        const { userId, newFullName } = req.body;

        // Find the user by ID and update the full name
        await User.User.findByIdAndUpdate(userId, { fullname: newFullName })

        // Respond with a success message or data if needed
        res.json({ success: true, message: 'Full name updated successfully '})
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update full name' })
    }
}


const updateEmail = async (req,res) => {
    try {
        console.log('reached')
        const { userId, newEmail } = req.body;

        // Find the user by ID and update the full name
        await User.User.findByIdAndUpdate(userId, { email: newEmail })

        // Respond with a success message or data if needed
        res.json({ success: true, message: 'Email is updated successfully'})

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: fasle, message: 'Failed to update email'})
    }
}


const updatePhone = async (req,res) => {
    try {
        console.log('reached')
       const { userId, newPhoneNumber } = req.body;
       
       // Find the user by Id and update the full name
       await User.User.findByIdAndUpdate(userId, {phone: newPhoneNumber})

       // Respond with a success message or data if needed
       res.json({ success: true, message: 'Phone is updated successfullly'})

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update phone number'})
    }
}


const updatePassword = async (req,res) => {
    console.log('hello')
    try {
        const userId = req.session.userId;
        const { newPassword, confirmPassword } = req.body;
        // console.log('newPassword ',newPassword)
        // console.log('confirm password: ',confirmPassword)
        // console.log('reached here')
        const newPASSWORD = newPassword.newPassword
        const confirmPASSWORD = newPassword.confirmPassword

        // console.log('newPassword', newPASSWORD)
        // console.log('confrim password', confirmPASSWORD)
        if (newPASSWORD !== confirmPASSWORD ) {
            return res.status(400).json({ success: false, message: 'Password do not match'})

        }

        // Update the user's password in the database
        const user = await User.User.findById(userId)

        const hashedPassword = await bcrypt.hash(newPASSWORD, 10);
        // console.log('reached ----> ', hashedPassword)


        user.password = hashedPassword;
        // console.log(user.password)
        await user.save()

        return res.status(200).json({ success: true, message: 'Password updated successfully.'})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error'})
    }
}



const userAddress = async (req,res) => {
    try {
        const userId = req.session.userId;
        const user = await User.User.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found'})
        }

        const addresses = user.address
        // console.log('addresses ---> ', addresses)
        return res.status(200).json({ success: true, addresses })
        // console.log('a -->', a)
        // return a

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error'})        
    }
}


const modifyAddress = async (req,res) => {
    try {
        const userId = req.session.userId
        // console.log(userId)
        const user = await User.User.findById(userId)
        // console.log('user details ',user)
        const userCartQuantity = await User.User.findById(userId);
        
           let cartQuantity
        if (userCartQuantity){
            cartQuantity = userCartQuantity.cart.length;

        }

       
        res.render('users/address',{ userId,user,cartQuantity})



    } catch (error) {
        
    }
}


const updateAddress = async (req,res) => {
    try {
        console.log('fsjsjfljfsjsofoiwoijfkkfsdhfoijhfksdjk jflkdsjfj kjlkjflksjfksokfjsdhfihewioruoihfkjshfweoihfsfh jhjfhjishfuiwhfuihjisfhjaifuhsgfhsfjkshfhffhjfh')
        const index = req.query.index
        console.log('index ====== ', index)
        const userId = req.session.userId
        console.log('userId ======== ', userId)
        const updateData = req.body
        console.log('updatedata ============= ', updateData)
        console.log('req. body ===== ', req.body)
        const addressid = req.body.addressId
        console.log('update address id ',addressid)
       
        // Update the address based on the user's ID and address identifier (assuming "address" is an array)
  const updatedAddress = await User.User.findOneAndUpdate(
    { _id: userId, 'address._id': addressid },
    {
      $set: {
        'address.$.fullname': updateData.fullName, // Update "fullName" property
        'address.$.first_address': updateData.address, // Update "address" property
        'address.$.country': updateData.country,
        'address.$.state': updateData.state,
        'address.$.city': updateData.city,
        'address.$.pincode': updateData.pincode,
        'address.$.landmark': updateData.landmark,
        'address.$.mobileNumber': updateData.mobileNumber
      }
    },
    { new: true }
  );
    console.log('uupdated address    ',updateAddress)
  if (!updatedAddress) {
    return res.status(404).json({ message: 'Address not found' });
  }
  
  await updatedAddress.save()

  return res.status(200).json({ message: 'Address updated successfully', address: updatedAddress })
    } catch (error) {
        
    }
}


const getAddress = async (req,res) => {
    try {
        // const index = req.params.index;
        const index = req.query.index
        const userId = req.session.userId

        const user = await User.User.findById(userId)
        // console.log(user)
        // console.log(index)
        // console.log(user.address[index])
        const addressLength = user.address.length
        const address = user.address[index]
        console.log('address in get address ', address)
        if (index < 0 || index >= addressLength) {
            return res.status(404).json({ error: 'Address not found'})
        }

        res.json(address)
    } catch (error) {
        console.error(error);
    }
}


const deleteAddress = async (req,res) => {
    try {
        // taking id from query
        const addressId = req.query.index
        const userId = req.session.userId

        console.log('address Id : ',addressId)
        const user = await User.User.updateOne(
            { _id: userId },
            { $pull: { address: { _id: addressId } } }
        );

        if (user.nModified === 0) {
            return res.status(404).json({ success: false, message: 'User or address not found' });
        }

        return res.status(200).json({ success: true, message: 'Address deleted successfully' });


    } catch (error) {
        
    }

}



module.exports = {
    showUserProfile,
    updateFullName,
    updateEmail,
    updatePhone,
    updatePassword,
    userAddress,
    modifyAddress,
    updateAddress,
    getAddress,
    deleteAddress
}