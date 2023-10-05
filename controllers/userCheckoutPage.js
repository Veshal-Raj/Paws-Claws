const { generate } = require('otp-generator');
const User = require('../models/userModel')
const Order = require('../models/ordersModel')
const Razorpay = require('razorpay')

// Initialize the Razorpay instance with the key_id and key_secret
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // passing the key id form the env file
    key_secret:process.env.RAZORPAY_KEY_SECRET  // pasing the secret key from env file
})


// API signature
// {razorpayInstance}.{resourceName}.{methodName}(resourceId [, params])

// example

// instance.payments.fetch(paymentId)

const generateOrderNumber = () => {
    // Implement your logic here to generate a unique order number
    // You can use a combination of timestamp, random numbers, or any other method you prefer
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 10000);
    return `ORDER-${timestamp}-${randomPart}`;
};

const checkout = async (req, res) => {
    try {
        const userId = req.session.userId

        // Fetch the user data with the populated 'address' field
        const user = await User.User.findById(userId).populate('address');
        // console.log(user)

        

        // Finding the user with their cart data populated
        const userCart = await User.User.findById(userId).populate('cart.product_id')

        if (!userCart) {
            return res.status(404).render('error', { message: 'User is not found' })
        }
        let total = 0;
        userCart.cart.forEach((i)=>{
            // console.log(i.totalPrice,"ujujujujjj")
            total += i.totalPrice
        })
        // console.log("total: ", total)
        

        

        // Generate the order ID (you can use your logic here)
        const orderId = generateOrderNumber(); // Replace with your logic to generate the order ID

        res.render('users/checkoutpage', { userId, user,orderId,total })
    } catch (error) {
        console.error(error)
        res.render('error')
    }
}

const saveAddress = async (req, res) => {
    try {
        const formData = req.body
        // console.log(formData)

        const userId = req.session.userId

        // Find the user by ID
        const user = await User.User.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found ' })
        }

        // Create an address object
        const newAddress = {
            fullname: formData.firstName + ' ' + formData.lastName,
            first_address: formData.address,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            pincode: formData.pincode,
            landmark: formData.landmark,
            mobileNumber: formData.mobileNumber
        }

        // Push the new address to the address array
        user.address.push(newAddress)

        // Save the user document with the updated address
        await user.save()

       
        // Address added successfully
        return res.status(200).json({ message: 'Address added successfully', newAddress })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}



const proceedToPay = async (req, res) => {
    try {
        const { selectedAddress } = req.body
        // console.log("userCheckout.js ---> line 71 ",selectedAddress)


        const  userId = req.session.userId
        // console.log(user)
        const UserFound = await User.User.findById(userId)
        // console.log(UserFound)
        // console.log("cart: ",UserFound.cart)
       
        const cart = UserFound.cart
        const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

        // console.log("total amount: ", totalPrice);

        // generating order number
        const orderId = generateOrderNumber()

        // Create a new order using the Order model
        const order = new Order({
            orderNumber: orderId,
            customer: userId,
            products: req.session.cart,
            shippingAddress: selectedAddress,
            totalAmount: totalPrice,

        })

        // Save the order to the database
        await order.save()

        // create a Razorpay order 
        const razorpayOrder = await razorpay.orders.create({
            amount: totalPrice*100, // Amount in paisa (multiply by 100 for rupees)
            currency: 'INR',
            receipt:order.orderNumber,
        })
        
        // const chekorder = await Order.find(order)
        // console.log(chekorder)
        // console.log("custiomer in usrCheckoutpage ", chekorder.customer)
        res.json({ status: 'success',orderId:razorpayOrder.id, amount:razorpayOrder.amount, message: 'Payment successful' ,orderId});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}


const onlinePayment = async (req,res) => {
    try {
        const totalPrice = req.body.total
        const options = {
            amount: totalPrice*100, // Ra
            currency: 'INR',
        }

        const order = await razorpay.orders.create(options)
        res.json({orderId: order.id})
        // console.log(totalPrice)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    checkout,
    saveAddress,
    proceedToPay,
    onlinePayment
}