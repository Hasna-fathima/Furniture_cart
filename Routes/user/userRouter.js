import express from 'express'
import {Signin,Signup,usermessage} from '../../Controllers/userController/User.js';
import productController from '../../Controllers/Productcontroller/product.js';
import categoryController from '../../Controllers/Categorycontroller/category.js';
import Offers from '../../Controllers/offerController/offer.js';
import AddressController from '../../Controllers/addressController/userAddress.js';
import CartController from '../../Controllers/cartController/cart.js';
import OrderController from '../../Controllers/orderController/order.js'
import { authenticateUser, requireSignin } from '../../Middleware/auth.js';

const userRouter=express.Router();



userRouter.post('/signup',Signup);
userRouter.post('/signin',Signin);


          //-------product------//
          
 userRouter.get('/product',productController.getProductsByCategoryOrPrice);
 userRouter.get('/products',productController.getAllProducts);
 userRouter.get('/product/:Id',productController.getProductById);
 userRouter.post('/mainproduct',productController.addMainproduct)
         

          //----category-----------//

userRouter.get('/category',categoryController.getAllcategory)
userRouter.post('/addCate',requireSignin,categoryController.Createcategory)
userRouter.get('/category/:slug',requireSignin,categoryController.getcategorysBySlug)



         //-----messagesend-----/
userRouter.post('/message', usermessage)

         //------cart-------//
          
userRouter.post('/addcart/:userId',requireSignin,authenticateUser,CartController.addCart);
userRouter.patch('/cart/:cartId',requireSignin,authenticateUser,CartController.editcart);
userRouter.get('/cart/:userId',requireSignin,authenticateUser,CartController.getCartByUser);
userRouter.get('/cart',requireSignin,authenticateUser,CartController.viewCart)



            //--------Address--------//


userRouter.post('/address',authenticateUser,requireSignin,AddressController.createUserAddress)
userRouter.get('/address/:userId',requireSignin,authenticateUser,AddressController.getUserAddressById)
userRouter.put('/address',AddressController.updateUserAddressById)


         //-----Offers-----------//


userRouter.get('/offers',requireSignin,Offers.getAlloffers);
userRouter.get('/offers/:Id',requireSignin,Offers.getOfferbyId)




         // ---order----//


userRouter.get('/order', OrderController.getOrders);
userRouter.get('/order', OrderController.getOrder)
userRouter.post('/order',OrderController.addOrder)
userRouter.get('/acceptReturn/:id/:odrId',OrderController.requestsResponse)



export default userRouter

