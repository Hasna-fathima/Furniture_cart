import express from 'express';
import {  adminMiddleware, requireSignin } from '../Middleware/auth.js';
import { createProduct,getProductsBySlug, getProductDetailsById, updateproduct, deleteProductById, getAllProducts } from '../Controllers/Productcontroller';
import upload from '../Middleware/upload.js';

 const router = express.Router();

router.post('/create-product', upload.single('image'), createProduct);
router.get('/products/:slug', getProductsBySlug);
router.get('/product/:productId', getProductDetailsById);
router.delete('/product/deleteProductById/:productId', requireSignin,  adminMiddleware, deleteProductById);
router.post('/product/getProducts', requireSignin,  adminMiddleware, getAllProducts);
router.patch('/product/updateproduct/:id', requireSignin,  adminMiddleware, updateproduct);

export default router;