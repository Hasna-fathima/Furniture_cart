import express from 'express'
import {Signin,Signup,usermessage} from '../../Controllers/userController/User.js';
import productController from '../../Controllers/Productcontroller/product.js';
import categoryController from '../../Controllers/Categorycontroller/category.js';
import Offers from '../../Controllers/offerController/offer.js';
import AddressController from '../../Controllers/addressController/userAddress.js';
import CartController from '../../Controllers/cartController/cart.js';
import OrderController from '../../Controllers/orderController/order.js'
import returncontroller from '../../Controllers/return/return.js';
import passport from '../../Middleware/passport.js'
import ReviewController from '../../Controllers/Review/review.js';

const userRouter=express.Router();




userRouter.post('/signup',Signup);
userRouter.post('/signin',Signin);


          //-------product------//
          
 userRouter.get('/products',productController.getProductsByCategoryOrPrice);
 userRouter.get('/products',passport.authenticate('jwt', { session: false }),productController.getAllProducts);
 userRouter.get('/product/:Id',productController.getProductById);
 


          //----category-----------//

userRouter.get('/category',categoryController.getAllcategory)
userRouter.post('/addCate',categoryController.Createcategory)
userRouter.get('/category/:slug',categoryController.getcategorysBySlug)



         //-----messagesend-----/
userRouter.post('/message', usermessage)


         //------cart-------//
          
userRouter.post('/addcart/:userId',CartController.addCart);
userRouter.patch('/cart/:cartId',CartController.editcart);
userRouter.get('/cart/:userId',CartController.getCartByUser);
userRouter.get('/cart',CartController.viewCart)
userRouter.delete('/cart',CartController.deleteCartItem);

            //--------Address--------//


userRouter.post('/address',AddressController.createUserAddress)
userRouter.get('/address/:userId',AddressController.getUserAddressById)
userRouter.put('/address',AddressController.updateUserAddressById)


           //------return------//
userRouter.post('/return',returncontroller.Returnorder)

         //-----Offers-----------//

userRouter.get('/offers',Offers.getAlloffers);
userRouter.get('/offers/:Id',Offers.getOfferbyId)


         // ---order----//



userRouter.get('/order', OrderController.getOrder)
userRouter.post('/order',OrderController.addOrder)
userRouter.post('/razorpay/verify',OrderController.verify)
userRouter.get('/order/:userId',OrderController.orderview)
userRouter.post('/return',OrderController.orderReturn)
  

   //-----review-------/

userRouter.post('/review',ReviewController.reviewadd)
userRouter.get('/review/:productId',ReviewController.getreview)


export default userRouter
