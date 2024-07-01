import express from 'express';
import {Signin,Signup,Signout} from '../../Controllers/admin/adminController.js';
import productController from '../../Controllers/Productcontroller/product.js';
import categoryController from '../../Controllers/Categorycontroller/category.js';
import AddressController from '../../Controllers/addressController/userAddress.js';
import Offers from '../../Controllers/offerController/offer.js';
import OrderController from '../../Controllers/orderController/order.js'
import {upload} from '../../Middleware/upload.js';
import CartController from '../../Controllers/cartController/cart.js';
import adminController from '../../Controllers/admin/adminController.js';



const adminRouter = express.Router();

adminRouter.post('/signup', Signup);
adminRouter.post('/signin', Signin);
adminRouter.post('/signout',Signout);


                     //-----------product Controll-----------//


adminRouter.post('/create-product',upload.single('image'),productController.createProduct);
adminRouter.get('/product/:Id',productController.getProductById);
adminRouter.get('/product',productController.getProductsByCategoryOrPrice);
adminRouter.get('/products',productController.getAllProducts);
adminRouter.put('/product/:productId',upload.single('image'),productController.updateProduct)
adminRouter.delete('/productdelete/:productId',productController.deleteProductById);



                


                     //--------user manage----------------//

adminRouter.get('/getalluser',adminController.getAllusers);
adminRouter.get('/getuser/:id',adminController.getuserbyid);
adminRouter.post('/blockuser/:id',adminController.blockedusers);
adminRouter.post('/unblockusers/:id',adminController.unblockedusers)



                //---------message----//

adminRouter.get('/messages',adminController.viewmessage)


                   // -------------Category Control----------//


adminRouter.get('/category',categoryController.getAllcategory)
adminRouter.post('/addCate',categoryController.Createcategory)
adminRouter.put('/editCate/:id',categoryController.updatecategory)
adminRouter.get('/category/:slug',categoryController.getcategorysBySlug)
adminRouter.delete('/deleteCate/:id',categoryController.deletecategoryById)



             //-----0rder COntrolling-------------//
             
adminRouter.get('/Orders',OrderController.getOrders)
adminRouter.post('/order',OrderController.addOrder)
adminRouter.put('/updateOrderStatus/:orderId',OrderController.updateOrderstatus)
adminRouter.get('/returnView',OrderController.orderReturnView)
adminRouter.get('/acceptReturn/:id/:odrId',OrderController.requestsResponse)




              //------------UserAdrres------------//

adminRouter.get('/address',AddressController.getAllUserAddresses)
adminRouter.post('/address',AddressController.createUserAddress)
adminRouter.get('/address/:userId',AddressController.getUserAddressById)
adminRouter.put('/address',AddressController.updateUserAddressById)
adminRouter.delete('/address/:id',AddressController.deleteUserAddressById)



                       //----Dashbord------//

adminRouter.get('/count-orders-by-day',adminController.getOrderCountsPerDay)
adminRouter.get('/count-orders-by-month',adminController.getOrderCountsPerMonth)
adminRouter.get('/count-orders-by-year',adminController.getOrderCountsPerYear)
adminRouter.post('/salesreport',adminController.getTotalSalesReport)



                       //------0ffer---------//

adminRouter.get('/offers',Offers.getAlloffers);
adminRouter.get('/offers/:Id',Offers.getOfferbyId)
adminRouter.post('/offers',upload.single('image'),Offers.createoffers)
adminRouter.put('/offers/:id',upload.single('image'),Offers.editOfferbyId)
adminRouter.delete('/offers/:id',Offers.deleteOffer)




                       //-----------Cart---------//

adminRouter.post('/addcart/:userId',CartController.addCart);
adminRouter.patch('/cart/:cartId',CartController.editcart);
adminRouter.delete('/cart',CartController.deleteCartItem);
adminRouter.get('/cart/:userId',CartController.getCartByUser);
adminRouter.get('/cart',CartController.viewCart)




export default adminRouter;