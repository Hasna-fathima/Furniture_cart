import express from 'express'
import {Signin,Signup} from '../Controllers/userController/User.js';
const userRouter=express.Router();
import { authenticateUser } from '../Middleware/auth.js';



userRouter.post('/signup',Signup)
userRouter.post('/signin',authenticateUser,Signin)

export default userRouter