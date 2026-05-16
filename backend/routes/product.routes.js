import express from 'express'
import { addProduct, removeProduct } from '../controllers/product.controller.js';
import { isAdmin, isLoggedIn } from '../middlewares/auth.middleware.js';

const productRouter = express.Router()


productRouter.post('/add-product',isLoggedIn,isAdmin, addProduct),
productRouter.post('/remove-product',isLoggedIn,isAdmin, removeProduct)

export default productRouter;