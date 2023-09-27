const Product = require('../models/productsModel')
const User = require('../models/userModel')


// Route for adding a product to the cart
const addToCart = async (req,res) => {
    try {
        const { productId } = req.params
        
       

        // Retrieve the product details based on the productId
        const product = await Product.findById(productId)

        if (!product) {
            // Handle the case where the product with the given ID doesn't exist
            return res.status(404).json({ error: 'Product not found'})
        }

        // Extract the product details you need
        const { productName, price } = product

        // Find the user ID from the session
        const userId = req.session.userId

        // Find the user's cart or create one if it doesn't exist
        let user = await User.User.findById(userId)

        if (!user) {
            // Handle the case where the user doesn't exist 
            return res.status(404).json({error: 'User not found'})
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
            res.json({ message: 'Product added to cart',cart: user.cart})
    } catch (error) {
        console.error('Error:',error)
        res.status(500).json({ error: 'An error occurred while adding the product to the cart'})
    }
}

module.exports = {
    addToCart,
}