import express from 'express';
import CartModel from './schema.js';
import products from '../Products/schema.js';
import createHttpError from 'http-errors';

const cartsRouter = express.Router();

cartsRouter.post('/:ownerId/addToCart', async (req, res, next) => {
	try {
		const { productId, quantity } = req.body;

		const purchasedProduct = await products.findById(productId);

		if (purchasedProduct) {
			// 2. Is the product already in the active cart of the specified ownerId?

			const isProductThere = await CartModel.findOne({
				ownerId: req.params.ownerId,
				status: 'active',
				productId: productId,
			});

			if (isProductThere) {
				// 3. If product is already there --> increase previous quantity
				const cart = await CartModel.findOneAndUpdate(
					{
						ownerId: req.params.ownerId,
						status: 'active',
						productId: productId,
					}, // WHO. If we target not only the owner and the status but also the specific product (which is an element of products array), mongo is going to store the index of that element into a variable called "positional operator" --> $
					{
						$inc: { 'products.$.quantity': quantity }, // products[index].quantity += quantity
					}, // HOW we want to modify? By increasing the quantity of the product
					{
						new: true,
					},
				);
				res.send(cart);
			} else {
				const productToInsert = { ...purchasedProduct.toObject(), quantity };

				const cart = await CartModel.findOneAndUpdate(
					{ ownerId: req.params.ownerId, status: 'active' },
					{
						$push: { products: productToInsert },
					},
					{
						new: true,
						upsert: true, // if the "active" cart is not found --> just create it automagically
					},
				);

				res.send(cart);
			}
		} else {
			next(createHttpError(404, `Book with id ${productId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

export default cartsRouter;
