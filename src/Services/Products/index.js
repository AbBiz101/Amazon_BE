import express from 'express';
import productEndPoints from './router.js';

const {
	updateProduct,
	deleteProduct,
	getAllProducts,
	createProducts,
	getProductById,
	commentOnAProduct,
	allCommentsOfAProduct,
	getCommentOfAProductByID,
	editCommentOfAProductByID,
	deleteCommentOfAProductByID,
} = productEndPoints;

const productsRouter = express.Router();

productsRouter.route('/').post(createProducts).get(getAllProducts);

productsRouter
	.route('/:id')
	.put(updateProduct)
	.get(getProductById)
	.delete(deleteProduct);

productsRouter
	.route('/:pId/comment')
	.put(commentOnAProduct)
	.get(allCommentsOfAProduct);

productsRouter
	.route('/:productId/comment/:commentID')
	.get(getCommentOfAProductByID)
	.put(editCommentOfAProductByID)
	.delete(deleteCommentOfAProductByID);

export default productsRouter;
