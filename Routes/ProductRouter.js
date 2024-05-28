import express from 'express';
import { authenticateAdmin, requireSignin } from '../Middleware/auth';
import { Createproduct, getProductsBySlug, getProductDetailsById, updateproduct, deleteProductById, getAllProducts } from '../controller/product';
import multer from 'multer';
import shortid from 'shortid';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/product/create', requireSignin, authenticateAdmin, upload.array('productPicture'), Createproduct);
router.get('/products/:slug', getProductsBySlug);
router.get('/product/:productId', getProductDetailsById);
router.delete('/product/deleteProductById', requireSignin, authenticateAdmin, deleteProductById);
router.post('/product/getProducts', requireSignin, authenticateAdmin, getAllProducts);
router.patch('/product/updateproduct/:id', requireSignin, authenticateAdmin, updateproduct);

export default router;