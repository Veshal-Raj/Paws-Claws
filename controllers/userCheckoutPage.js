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
        const userId = req.session.userId;

        // Taking the count of products in the cart
        const userForCartQuantity = await User.User.findById(userId);
        

           let cartQuantity
        if (userForCartQuantity){
            cartQuantity = userForCartQuantity.cart.length;

        }


        // Fetch the user data with the populated 'address' field
        const user = await User.User.findById(userId).populate('address').lean();

        // Finding the user with their cart data populated
        const userCart = await User.User.findById(userId).populate('cart.product_id').lean();

        if (!userCart) {
            return res.status(404).render('error', { message: 'User is not found' });
        }

        const cartDetailsWithProduct = [];
        let total = 0;

        for (const cartItem of userCart.cart) {
            const product = await Product.findById(cartItem.product_id);
            const productImage = product.productImages[0]; // productImages is an array of image paths

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
            cartQuantity
        });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
};



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
        let index = user.address.length
        user.address.push(newAddress)

        // Save the user document with the updated address
        await user.save()

        let id = user.address[index]._id
              
        // Address added successfully
        return res.status(200).json({ message: 'Address added successfully', newAddress,index ,id})
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getAddress = async (req,res) => {
    try {
        
        const userId = req.session.userId; // taking the userId from the session
        
        const addressId = req.params.id; // taking the addressId from the params that is sending from the client sides

        // Find the user by ID and filter the address array to get the matching address
        const user = await User.User.findById(userId);

        if (!user) {
        // Handle case when the user is not found
        return res.status(404).json({ error: 'User not found' });
        }

        const address = user.address.id(addressId);
        

        if (!address) {
            // Handle case when the address is not found
            return res.status(404).json({ error: 'Address not found' });
        }

         // Send the found address as a JSON response
        res.json({ address });

    } catch (error) {
        console.error(error)
        res.render('error')
    }
}


const deletingAddressWhileEditing = async (req,res) => {
    try {
        const addressId = req.params.addressId // expecting address id that is send from the front end 
        const userId = req.session.userId // Get the user's Id from the session

        // deleting the user's particular addresss while  editing
        const deleteAddress = await User.User.findByIdAndUpdate(
            userId,
            {$pull: { address: { _id: addressId } } },
            { new: true } // To return the updated user
            )

            if (!deleteAddress) {
                // Handle case when the address is not deleted
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Respond with a success message 
            res.status(200).json({ success: true, message: 'Address deleted successfully '})

    } catch (error) {
        console.error(error);
        res.render('error')
    }
}


const deleteOrder = async (req,res) => {
    try {
        const addressId = req.params.addressId;
        const userId = req.session.userId; // Get the user's ID from the session
    
        // Update the user  to remove the address using $pull
        const updatedUser = await User.User.findByIdAndUpdate(
          userId,
          { $pull: { address: { _id: addressId } } },
          { new: true } // To return the updated user 
        );
    
        if (!updatedUser) {
          // Handle the case where the user  is not found
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        // Respond with a success message
        res.json({ success: true, message: 'Address deleted successfully' });
      }  catch (error) {
        console.error(error);
        res.redirect('/something')
    }
}

// COD
const proceedToPay = async (req, res) => {
    
    try {
        // Extract the selected address from the request body
        const { selectedAddress } = req.body
        
        // Get the user's ID from the session        
        const  userId = req.session.userId

        // Find the user by their ID
        const UserFound = await User.User.findById(userId)
       
        // Retrieve the user's cart
        const cart = UserFound.cart
       
        // Calculate the total price by summing up the total prices of items in the cart
        const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

        

        // generating order number
        const orderId = generateOrderNumber()

        // Define the payment method (in this case, Cash on Delivery - COD)
        const paymentMethod = 'COD'; //

        // Create a new order using the Order model
        const Neworder = new Order({
            orderNumber: orderId,
            customer: userId,
            products: cart,
            shippingAddress: selectedAddress,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod, // Set the payment method to 'COD'

        })

             // Reduce the quantity of ordered products in the database
  for (const cartItem of cart) {
    const product = await Product.findById(cartItem.product_id);
    console.log('before',product.quantityInStock)

    if (product) {
      if (product.quantityInStock >= cartItem.quantity) {
        product.quantityInStock -= cartItem.quantity; // Reduce the stock
      } else {
        return res.status(400).json({ error: 'Insufficient stock for one or more products' });
      }
    console.log('after',product.quantityInStock)
      // Save the updated product
      await product.save();
    } else {
      return res.status(400).json({ error: 'Product not found' });
    }
  }
        
        // Save the order to the database
        let newOrderSave = await Neworder.save()

        // Send a response indicating a successful order creation
        res.json({ status: 'success', message: 'Order created successful' });
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}


// Onlilne payment
const onlinePayment = async (req,res) => {
    try {
        // Extract the total price and selected address from the request body
        const totalPrice = req.body.total
        const  selectedAddress  = req.body.selectedAddress
        

        // Get the user's ID from the session
        const  userId = req.session.userId

        // Find the user by their ID
        const UserFound = await User.User.findById(userId)
        
        // Retrieve the user's cart
        const cart = UserFound.cart

        // Calculate the total sum of prices in the cart
        const totalSumPrice = cart.reduce((total, item) => total + item.totalPrice, 0);


        // generating order number
        const orderId = generateOrderNumber()

        // Define the payment method (in this case, Online Payment)
        const paymentMethod = 'Online Payment'; 

        // Create a new order using the Order model
        const Neworder = new Order({
            orderNumber: orderId,
            customer: userId,
            products: cart,
            shippingAddress: selectedAddress,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod, // Set the payment method to 'COD'

        })

             // Reduce the quantity of ordered products in the database
  for (const cartItem of cart) {
    const product = await Product.findById(cartItem.product_id);
    console.log('before',product.quantityInStock)

    if (product) {
      if (product.quantityInStock >= cartItem.quantity) {
        product.quantityInStock -= cartItem.quantity; // Reduce the stock
      } else {
        return res.status(400).json({ error: 'Insufficient stock for one or more products' });
      }
    console.log('after',product.quantityInStock)
      // Save the updated product
      await product.save();
    } else {
      return res.status(400).json({ error: 'Product not found' });
    }
  }

        // Save the order to the database
         await Neworder.save()

        // Prepare payment options for Razorpay
        const options = {
            amount: totalSumPrice*100, // converting paisa to ruppes
            currency: 'INR',
        }

        // Create a new payment order using Razorpay
        const order = await razorpay.orders.create(options)

        // Send the Razorpay order ID in the response
        res.json({orderId: order.id})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}


// Wallet
const wallet = async (req,res) => {
    try {
        
        // Extract the selected address and payment method from the request body
        const selectedAddress = req.body.selectedAddress;
        
        const paymentMethod  = req.body.paymentMethod;
        

        // Get the user's ID from the session
        const userId = req.session.userId;    
        
        
        // Find the user by their ID
        const user = await User.User.findById(userId)
        

        // Retrieve the user's cart
        const cart = user.cart;
        

        // Calculate the total price by summing up to total prices of items in the cart
        const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0)
        

        if (paymentMethod === 'wallet') {
            // Check if ther's enough balance in the user's wallet for the purchase
            if (user.wallet.balance < totalPrice ) {
                return res.status(400).json({ error: 'Insufficient wallet balance '})
            }

            // Deduct the purchase amount from the user's wallet balance
            

            user.wallet.balance  -= totalPrice
            
            // Generate an order number
            const orderNumber = generateOrderNumber()

           // Create a new order
           const newOrder = new Order({
            orderNumber,
            customer: userId,
            products: cart,
            shippingAddress: selectedAddress,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod,
        });


        // Reduce the quantity of ordered products in the database
  for (const cartItem of cart) {
    const product = await Product.findById(cartItem.product_id);
    console.log('before',product.quantityInStock)

    if (product) {
      if (product.quantityInStock >= cartItem.quantity) {
        product.quantityInStock -= cartItem.quantity; // Reduce the stock
      } else {
        return res.status(400).json({ error: 'Insufficient stock for one or more products' });
      }
    console.log('after',product.quantityInStock)
      // Save the updated product
      await product.save();
    } else {
      return res.status(400).json({ error: 'Product not found' });
    }
  }



            // Clear the user's cart
            user.cart = []



            // Save changes to the database
            await Promise.all([newOrder.save(), user.save()])

        }

        // Respond with a success message or any other necessary response
        res.status(200).json({ message: 'Purchase successful' })  
    
    } catch (error) {
        console.error(error);
        res.status(500).json( {error: 'Internal Server Error'} )
    }
}


const clearCart = async (req,res) => {
    try {
        // Get the user's ID from the session
        const userId = req.session.userId

    // find the user by userId
    const user = await User.User.findById(userId)

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

     
    // Clear the user's cart by setting it to an empty array
    user.cart = [];
     
    // Save the updated user document to clear the cart
    await user.save();

    // Return a success message indicating that the cart has been cleared
    return res.json({ success: true, message: 'Cart cleared successfully' });

    } catch (error) {
        console.error(error);
        res.render('error')
    }    
}

module.exports = {
    checkout,
    saveAddress,
    proceedToPay,
    onlinePayment,
    wallet,
    deleteOrder,
    getAddress,
    deletingAddressWhileEditing,
    clearCart
}