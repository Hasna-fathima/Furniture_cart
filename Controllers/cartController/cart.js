import Cart from '../../Models/Cartmodel.js';
import Product from '../../Models/prodectmodel.js';
import mongoose from 'mongoose';
import userModel from '../../Models/Usermodel.js';





const addCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId });

        if (!cart) {
            cart = new Cart({ user: req.params.userId, cartItems: [] });
        }

        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);
        if (itemIndex !== -1) {
            cart.cartItems[itemIndex].quantity += quantity;
        } else {
            cart.cartItems.push({ 
                product: productId, 
                quantity,
                image: product.imagePublicId,
                name: product.name,
                price: product.price
            });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
        








    const getCartByUser= async (req, res) => {
      try {
        const { userId } = req.params;
    
        if (!userId) {
          return res.status(400).json({ error: 'Missing user ID' });
        }
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: 'Invalid user ID format' });
        }
    
        const cart = await Cart.findOne({ user: userId }).populate({
          path: 'cartItems.product',
          select: 'name price imagePublicId',
        });
    
        if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
        }
    
        const populatedCartItems = cart.cartItems.map(item => {
          console.log('Product:', item.product); // Log to check the populated product
          return {
            product: item.product._id,
            quantity: item.quantity,
            name: item.product.name,
            imagePublicId: item.product.imagePublicId, // Ensure this field exists
            price: item.product.price,
          };
        });
    
        console.log('Populated Cart Items:', populatedCartItems); // Log to verify populated items
    
        res.json({ cartItems: populatedCartItems, cartId: cart._id });
      } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
      }
    };
    



    const viewCart=async(req,res)=>{
      try{
        const cart = await Cart.find({});
        if (!cart) {
          return res.status(404).json({ error: 'cart are not found' });
        }
        return res.status(200).json(cart);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    };
      

    const editcart = async (req, res) => {
      try {
        const { cartId } = req.params;
        const { productId, quantity } = req.body;
    

        console.log(`Received cartId: ${cartId}, productId: ${productId}, quantity: ${quantity}`);

        if (!cartId || !productId || quantity == null) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Ensure the cartId is in the correct format (for example, a MongoDB ObjectId)
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
          return res.status(400).json({ error: 'Invalid cart ID format' });
        }
    
        // Find the cart by ID
        const cart = await Cart.findById(cartId);
    
        if (!cart) {
          console.log(`Cart not found for cartId: ${cartId}`);
          return res.status(404).json({ error: 'Cart not found' });
        }
    
        // Ensure the cart has a cartItems array
        if (!cart.cartItems || !Array.isArray(cart.cartItems)) {
          console.log(`Cart found but it does not contain a cartItems array`);
          return res.status(400).json({ error: 'Cart does not contain a cartItems array' });
        }
    
        // Find the product within the cartItems
        const product = cart.cartItems.find(item => item.product.toString() === productId);
    
        if (!product) {
          console.log(`Product not found in cart for productId: ${productId}`);
          return res.status(404).json({ error: 'Product not found in cart' });
        }
    
        // Update product quantity
        product.quantity = quantity;
    
        // Save the updated cart
        const updatedCart = await cart.save();
        res.json(updatedCart);
      } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Failed to update cart' });
      }
    };



     
const deleteCartItem = async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  if (!userId || !productId) {
      res.status(400).json({ message: 'User ID and Product ID are required in the request body' });
      return;
  }

  Cart.findOneAndUpdate(
 
      { user: userId },
      
      { $pull: { cartItems: { product: productId } } },
      
      { new: true }
  )
      .then(updatedCart => {
        
          if (updatedCart) {
        
              res.json({ message: 'Cart item removed', cart: updatedCart });
          } else {
        
              res.status(404).json({ message: 'Cart item not removed' });
          }
      })
      .catch(error => {

          console.error('Error removing cart item:', error);
          res.status(500).json({ message: 'Internal server error' });
      });
}
    



const CartController={ addCart,viewCart,editcart,deleteCartItem,getCartByUser}
export default CartController

