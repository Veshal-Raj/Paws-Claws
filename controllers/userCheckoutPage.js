const { generate } = require('otp-generator');
const User = require('../models/userModel')
const Order = require('../models/ordersModel')


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

const generateOrderNumber = () => {
    // Implement your logic here to generate a unique order number
    // You can use a combination of timestamp, random numbers, or any other method you prefer
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 10000);
    return `ORDER-${timestamp}-${randomPart}`;
};

const proceedToPay = async(req,res) => {
    try {
        const { selectedAddress } = req.body
        console.log("userCheckout.js ---> line 61 ",selectedAddress)

        userId = req.session.userId
        // console.log(user)
        const UserFound = await User.User.findById(userId)
        console.log(UserFound)
        // console.log("cart: ",UserFound.cart)
        const cart = UserFound.cart

        const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

        console.log("total amount: ", totalPrice);
        
        // Create a new order using the Order model
        const order = new Order ({
            orderNumber: generateOrderNumber(),
            customer:userId,
            products: req.session.cart,
            shippingAddress:selectedAddress,
            totalAmount:totalPrice,

        })

        // Save the order to the database
        await order.save()

        const chekorder = await Order.find(order)
        console.log(chekorder)

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