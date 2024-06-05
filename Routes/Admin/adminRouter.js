import express from 'express';
import { Signup, Signin,Signout} from '../../Controllers/admin/adminController.js';
import productController from '../../Controllers/Productcontroller/product.js';
import Offers from '../../Controllers/admin/offerController/offer.js';
import {upload} from '../../Middleware/upload.js';
import { requireSignin,authenticateAdmin } from '../../Middleware/auth.js';


const adminRouter = express.Router();

adminRouter.post('/signup', Signup);
adminRouter.post('/signin', Signin);
adminRouter.post('/signout',requireSignin,Signout);
adminRouter.get('/getdashboard',getdashboard);


                     //-----------product Controll-----------//


adminRouter.post('/create-product',upload.single('image'),authenticateAdmin, requireSignin,productController.createProduct); adminRouter.get('/product',requireSignin,productController.getProductsByCategoryOrPrice);
adminRouter.get('/products',productController.getAllProducts);
adminRouter.put('/product/:productId',upload.single('image'),requireSignin,authenticateAdmin,productController.updateProduct)
adminRouter.delete('/productdelete/:productId',requireSignin,authenticateAdmin,productController.deleteProductById);
                


                     //--------user manage----------------//

adminRouter.get('/getalluser',getAllusers);
adminRouter.get('/getuser',getuserbyId);
adminRouter.get('/blockuser',blockedusers);
adminRouter.get('/unblockusers',unblockedusers)



                   // -------------Category Control----------//


 adminRouter.get('/category',requireSignin,authenticateAdmin,getCategory)
adminRouter.post('/addCate',requireSignin,authenticateAdmin,AddCategory)
adminRouter.get('/editCate/:id',requireSignin,authenticateAdmin,getEditCate)
adminRouter.post('/editCate/:id',requireSignin,authenticateAdmin,EditCate)
adminRouter.get('/deleteCate/:id',requireSignin,authenticateAdmin,deleteCategory)
adminRouter.get('/unlistCategory/:id',requireSignin,authenticateAdmin,unlistCategory)
adminRouter.get('/listCategory/:id',requireSignin,listCategory)


             //-----0rder COntrolling-------------//


             
adminRouter.get('/order',authenticateAdmin,requireSignin,getOrders)
adminRouter.get('/updateOrderStatus/:status/:id',authenticateAdmin,requireSignin,orderStatusUpdate)
adminRouter.get('/returnView/:id',authenticateAdmin,requireSignin,order.orderReturnView)
adminRouter.get('/returnRequestList',requireSignin,authenticateAdmin,returnRequests)
adminRouter.get('/acceptReturn/:id/:odrId',authenticateAdmin,requireSignin,acceptOrderReturn)
adminRouter.get('/rejectReturn/:id/:odrId',authenticateAdmin,requireSignin,rejectOrderReturn)
adminRouter.get('/orderView/:id',requireSignin,authenticateAdmin,viewOrderDeatails)



                       //----Dashbord------//


adminRouter.get('/count-orders-by-day',requireSignin,authenticateAdmin,dashboard.getCount)
adminRouter.get('/count-orders-by-month',requireSignin,authenticateAdmin,dashboard.getCount)
adminRouter.get('/count-orders-by-year',requireSignin,authenticateAdmin,dashboard.getCount)
adminRouter.post('/salesreport',requireSignin,authenticateAdmin,dashboard.downloadSalesReport)



                        //----Banner-------//

 adminRouter.get('/banner',getBanner)
 adminRouter.get('/addbannerpage',getAddBanner)
 adminRouter.post('/addbanner',postAddBanner)

                       //------0ffer---------//

adminRouter.get('/offers',Offers.getAlloffers);
adminRouter.get('/offers/:Id',Offers.getOfferbyId)
adminRouter.post('/offers',Offers.createoffers)
adminRouter.put('/offers/:Id',Offers.editOfferbyId)
adminRouter.delete('/offers/:Id',Offers.deleteOffer)




export default adminRouter;