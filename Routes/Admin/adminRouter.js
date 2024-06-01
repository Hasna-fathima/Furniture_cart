import express from 'express';
import { Signup, Signin,Signout} from '../../Controllers/admin/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/signup', Signup);
adminRouter.post('/signin', Signin);
adminRouter.post('/signout',Signout)


export default adminRouter;