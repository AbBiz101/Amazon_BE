import multer from 'multer';
import express from 'express';
import productEndPoints from './router.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const {
	createImg,
	updateProduct,
	deleteProduct,
	getAllProducts,
	createProducts,
	getProductById,
} = productEndPoints;

const productsRouter = express.Router();

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'Amazon',
	},
});
productsRouter
	.route('/Image')
	.post(multer({ storage: cloudinaryStorage }).single('product'), createImg);

productsRouter.route('/').post(createProducts).get(getAllProducts);

productsRouter
	.route('/:productId')
	.put(updateProduct)
	.get(getProductById)
	.delete(deleteProduct);
export default productsRouter;
