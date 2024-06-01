import express from 'express'
import {Signin,Signup} from '../Controllers/userController/User.js';
const userRouter=express.Router();


userRouter.post('/signup',Signup)
userRouter.post('/signin',Signin)

export default userRouter