const { generate } = require('otp-generator');
const User = require('../models/userModel')
const Order = require('../models/ordersModel')
const Product = require('../models/productsModel')
const Razorpay = require('razorpay')

// Initialize the Razorpay instance with the key_id and key_secret
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // passing the key id form the env file
    key_secret:process.env.RAZORPAY_KEY_SECRET  // pasing the secret key from env file
})


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

        // Finding the user with their cart data populated
        const userCart = await User.User.findById(userId).populate('cart.product_id');

        if (!userCart) {
            return res.status(404).render('error', { message: 'User is not found' });
        }

        let total = 0;
        const cartDetailsWithProduct = [];

        

        for (const cartItem of userCart.cart) {
            const product = await Product.findById(cartItem.product_id);
            const productImage = product.productImages[0]; //  productImages is an array of image paths

            cartDetailsWithProduct.push({
                product_id: cartItem.product_id,
                product_name: product.productName,
                price: product.price,
                quantity: cartItem.quantity,
                totalPrice: cartItem.totalPrice,
                productImage: productImage,
            });

            total += cartItem.totalPrice;
        }

        // Generate the order ID (you can use your logic here)
        const orderId = generateOrderNumber(); // Replace with your logic to generate the order ID

        res.render('users/checkoutpage', {
            userId,
            user,
            orderId,
            total,
            cartdetails: cartDetailsWithProduct,
        });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
}


const saveAddress = async (req, res) => {
    try {
        const formData = req.body

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
    console.log('hiello')
    try {
        const { selectedAddress } = req.body
        // console.log("userCheckout.js ---> line 71 ",selectedAddress)


        const  userId = req.session.userId
        const UserFound = await User.User.findById(userId)
       
        const cart = UserFound.cart
        const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

        // generating order number
        const orderId = generateOrderNumber()

        const paymentMethod = 'Online Payment'; //

        // Create a new order using the Order model
        const order = new Order({
            orderNumber: orderId,
            customer: userId,
            products: req.session.cart,
            shippingAddress: selectedAddress,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod, // Set the payment method to 'Online Payment'

        })

        console.log("order ==",order)
        // Save the order to the database
        let newOrderSave = await order.save()

        console.log('new Order ',newOrderSave)

        
        res.json({ status: 'success', message: 'Order created successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}


const onlinePayment = async (req,res) => {
    try {
        const totalPrice = req.body.total
        const  selectedAddress  = req.body.selectedAddress
        // console.log("userCheckout.js ---> line 71 ",selectedAddress)


        const  userId = req.session.userId
        const UserFound = await User.User.findById(userId)
       
        const cart = UserFound.cart
        const totalSumPrice = cart.reduce((total, item) => total + item.totalPrice, 0);


        // generating order number
        const orderId = generateOrderNumber()

        const paymentMethod = 'Online Payment'; //

        // Create a new order using the Order model
        const Neworder = new Order({
            orderNumber: orderId,
            customer: userId,
            products: req.session.cart,
            shippingAddress: selectedAddress,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod, // Set the payment method to 'COD'

        })

         await Neworder.save()


        const options = {
            amount: totalSumPrice*100, // converting paisa to ruppes
            currency: 'INR',
        }

        const order = await razorpay.orders.create(options)
        res.json({orderId: order.id})

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