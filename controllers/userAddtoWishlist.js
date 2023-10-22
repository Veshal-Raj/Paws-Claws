const User = require('../models/userModel')
const Product = require('../models/productsModel')


const showWishlist = async (req,res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.json({ message: 'User not found'})
        } 

        const user = await User.User.findById(userId)
        
        let cartQuantity
        if (user){
            cartQuantity = user.cart.length;

        }

        // Finding the user with their wishlist data populated
        const userWishlist = await User.User.findById(userId).populate('wishlist.product_id')

        if (!userWishlist) {
            // Handle the case where the user doesn't exist
            return res.status(404).render('error', { message: 'User is not found' })
        }
        console.log('user wishlist: ', userWishlist)

        res.render('users/wishlist',{ user, userId, cartQuantity, userWishlist })
    } catch (error) {
        console.error(error);
        res.render('error')
    }
}


const addToWishlist = async (req,res) => {
    try {
        const userId = req.session.userId; // Get the user's ID from the session
    const productId = req.body.productId; // Get the product ID from the request body

    // Check if the user and product exist
    const user = await User.User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(400).json({ success: false, message: 'User or product not found' });
    }

    // Check if the product is already in the user's wishlist
    const isProductInWishlist = user.wishlist.some(item => item.product_id.equals(productId));

    if (isProductInWishlist) {
      return res.status(200).json({ success: false, message: 'Product is already in the wishlist' });
    }

    // Add the product to the user's wishlist
    user.wishlist.push({
      product_id: product._id,
      product_name: product.productName,
      price: product.price.toFixed(2), // You can format the price as needed
    });
    console.log('wishlist--> ',user.wishlist)
    // Save the updated user document
    await user.save();

     



    return res.status(200).json({ success: true, message: 'Product added to wishlist' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


const removeFromWishlist = async (req,res) => {
    try {
        const userId = req.session.userId;
        const wishlistItemId = req.body.wishlistItemId;

        // Find the user
        const user = await User.User.findById(userId);

        // Remove the item from the wishlist based on the wishlistItemId
        user.wishlist = user.wishlist.filter((item) => item._id != wishlistItemId);

        // Save the updated user document
        await user.save();

        res.status(200).json({ success: true, message: 'Product removed from wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }    
    
}

module.exports = {
    showWishlist,
    addToWishlist,
    removeFromWishlist
}