import express from 'express';
import productEndPoints from './router.js';

const {
	updateProduct,
	deleteProduct,
	getAllProducts,
	createProducts,
	getProductById,
} = productEndPoints;

const productsRouter = express.Router();

productsRouter.route('/').post(createProducts).get(getAllProducts);

productsRouter
	.route('/:productId')
	.put(updateProduct)
	.get(getProductById)
	.delete(deleteProduct);
export default productsRouter;
