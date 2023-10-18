const Product = require('../models/productsModel')
const User = require('../models/userModel')


// Route for adding a product to the cart
const addToCart = async (req, res) => {
    try {
        // Extract the productId from the request parameters
        const { productId } = req.params

        // Retrieve the product details based on the productId
        const product = await Product.findById(productId)

        if (!product) {
            // Handle the case where the product with the given ID doesn't exist
            return res.status(404).json({ error: 'Product not found' })
        }

        // Extract the product details you need
        const { productName, price } = product

        // Find the user ID from the session
        const userId = req.session.userId

        // Find the user's cart or create one if it doesn't exist
        let user = await User.User.findById(userId)

        if (!user) {
            // Handle the case where the user doesn't exist 
            return res.status(404).json({ error: 'User not found' })
        }

        // Check if the product is already in the cart
        const existingCartItem = user.cart.find((item) => item.product_id.toString() === productId)


        if (existingCartItem) {
            // If the product is already in the cart, increase the quantity
            existingCartItem.quantity += 1;
            existingCartItem.totalPrice = existingCartItem.price * existingCartItem.quantity
        } else {
            // If the product is not in the cart, add it 
            const cartItem = {
                product_id: productId,
                product_name: productName,
                price: price,
                quantity: 1, // Assuming you're adding one item by default
                totalPrice: price, // Set the initial total price 
            }

            // Add the new cart item to the user's cart
            user.cart.push(cartItem)

        }
        // Save the updated user datas with the cart to the database
        await user.save()

        // Respond with a success messsage or updated cart data
        res.json({ message: 'Product added to cart', cart: user.cart })

    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ error: 'An error occurred while adding the product to the cart' })
    }
}

const showCart = async (req, res) => {
    try {
        // Get the user ID from the session
        const userId = req.session.userId

        const userCart = await User.User.findById(userId)
        
        let cartQuantity
        if (userCart){
            cartQuantity = userCart.cart.length;

        }

        // Finding the user with their cart data populated
        const user = await User.User.findById(userId).populate('cart.product_id')

        if (!user) {
            // Handle the case where the user doesn't exist
            return res.status(404).render('error', { message: 'User is not found' })
        }


        // Calculating total sum of the  product in cart
        const totalSum = user.cart.reduce((sum, cartItem) => {
            return sum + cartItem.totalPrice
        }, 0)

        // Fetch the product stock quantity from the database for products in the cart
const productIdsInCart = user.cart.map(cartItem => cartItem.product_id._id);
const productStockQuantities = await Product.find(
    { _id: { $in: productIdsInCart } },
    'quantityInStock'
).lean();

// Create an object to store the product stock quantities by product ID
const productStockMap = {};

productStockQuantities.forEach(product => {
    productStockMap[product._id.toString()] = product.quantityInStock;
});


      


        // Render the cart page and pass the user's cart data to the cart page
        res.render('users/cart', { user, userId: req.session.userId, totalSum , cartQuantity, productStockMap })
   
    } catch (error) {
        console.error(error)
        res.status(500).render('error')
    }
}

const updateQuantity = async (req, res) => {
    try {
        // Extract the productId and newQuantity from the request parameters
        const { productId, newQuantity } = req.params
        const userId = req.session.userId

        // Finding the user and their cart
        const user = await User.User.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Find the cart item with the matching product ID
        const cartItem = user.cart.find((item) => item.product_id.toString() === productId)

        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in the cart' })
        }

        // Update the quantity and total price
        cartItem.quantity = parseInt(newQuantity)
        cartItem.totalPrice = cartItem.price * cartItem.quantity

        // Calculating total sum of the  product in cart
        const totalSum = user.cart.reduce((sum, cartItem) => {
            return sum + cartItem.totalPrice
        }, 0)


        // Save the user with the updated cart
        await user.save()

        // Respond with the updated total price
        res.json({ updatedTotalPrice: cartItem.totalPrice, totalSum })
    } catch (error) {
        console.error('Error:', error)
    }
}

const removeFromCart = async (req, res) => {
    try {
        // Extract the productId and newQuantity from the request parameters
        const { productId } = req.params
        const userId = req.session.userId

        // Find the user and their cart
        let user = await User.User.findById(userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found ' })
        }

        // Remove the cart item wiht the matching product ID
        await user.cart.pull({ product_id: productId })

        await user.save()

        user = await User.User.findById(userId)


        // Calculate the updated total sum
        const totalSum = user.cart.reduce((sum, cartItem) => {
            return sum + cartItem.totalPrice
        }, 0)

        // save the user with the updated cart
        await user.save()
        
        // respond with the updated total sum
        res.json({ updatedTotalSum: totalSum })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error ' })
    }
}

module.exports = {
    addToCart,
    showCart,
    updateQuantity,
    removeFromCart
}