import express from 'express'
import {Signin,Signup,Signout} from '../../Controllers/userController/User.js';
import productController from '../../Controllers/Productcontroller/product.js';
import { requireSignin } from '../../Middleware/auth.js';

const userRouter=express.Router();

userRouter.post('/signup',Signup);
userRouter.post('/signin',Signin);
userRouter.post('/signout',Signout)



          //-------product------//
          
 userRouter.get('/product',requireSignin,productController.getProductsByCategoryOrPrice);
 userRouter.get('/products',productController.getAllProducts);



export default userRouter