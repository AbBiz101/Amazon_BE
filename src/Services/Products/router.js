import comments from '../Comments/schema.js';
import createHttpError from 'http-errors';
import products from './schema.js';
//import q2m from 'query-to-mongo';

/* ******************** Product endpoints *************************** */

const getAllProducts = async (req, res, next) => {
	try {
		const allProducts = await products.find();
		res.status(200).send(allProducts);
	} catch (error) {
		res.status(500).send();
		next(error);
	}
};

const createProducts = async (req, res, next) => {
	try {
		const newProducts = new products(req.body);
		const { _id } = await newProducts.save();
		res.status(201).send(_id);
	} catch (error) {
		console.log(error);
		res.status(500).send();
		next(error);
	}
};

const getProductById = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await products.findById(id);
		if (product) {
			res.status(200).send(product);
		} else {
			res.status(404).send('No product found with this id.');
		}
	} catch (error) {
		res.status(500).send();
		next(error);
	}
};

const updateProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const updateProduct = await products.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (updateProduct) {
			res.status(201).send(updateProduct);
		} else {
			res.status(404).send();
		}
	} catch (error) {
		res.send(500).send();
		next(error);
	}
};

const deleteProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await products.findByIdAndDelete(id);
		if (product) {
			res.status(204).send();
		} else {
			res.status(404).send();
		}
	} catch (error) {
		res.send(500).send();
		next(error);
	}
};

/* *********************** comment endpoints ************************ */

const commentOnAProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await products.findById(id);
		if (!product) {
			res.status(404).send({ message: `product with ${id} is not found!` });
		} else {
			await products.findByIdAndUpdate(
				req.params.productId,
				{
					$push: {
						productComment: req.body,
					},
				},
				{ new: true },
			);
			res.status(204).send();
		}
	} catch (error) {
		res.send(500).send();
		next(error);
	}
};

const allCommentsOfAProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await products.findById(id);
		if (product) {
			console.log(product.productComment);
			res.status(200).send(product.productComment);
		} else {
			res.status(404).send(`Product with id ${id} not found!`);
		}
	} catch (error) {
		res.send(500).send();
		next(error);
	}
};

const getCommentOfAProductByID = async (req, res, next) => {
	try {
		const product = await products.findById(req.params.productId);
		if (product) {
			const commentIndex = product.productComment.findIndex(
				(comment) => comment._id.toString() === req.params.commentID,
			);
			if (commentIndex === -1) {
				res.status(404).send({
					message: `Comment with ${req.params.commentID} is not found!`,
				});
			} else {
				const obj = product.productComment[commentIndex];
				console.log(product.productComment[commentIndex]);
				res.status(204).send(obj);
			}
		} else {
			res.status(404).send({
				message: `Product with ${req.params.productId} is not found!`,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};

const editCommentOfAProductByID = async (req, res, next) => {
	try {
		const product = await products.findById(req.params.productId);
		if (product) {
			const commentIndex = product.productComment.findIndex(
				(comment) => comment._id.toString() === req.params.commentID,
			);
			if (commentIndex === -1) {
				res.status(404).send({
					message: `Comment with ${req.params.commentID} is not found!`,
				});
			} else {
				console.log(product.productComment[commentIndex], req.body);
				product.productComment[commentIndex] = {
					...product.productComment[commentIndex],
					...req.body,
				};
				// await product.save();
				res.status(204).send();
			}
		} else {
			res.status(404).send({
				message: `Product with ${req.params.productId} is not found!`,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};

const deleteCommentOfAProductByID = async (req, res, next) => {
	try {
		const product = await products.findById(req.params.productId);
		if (product) {
			const commentIndex = product.productComment.findIndex(
				(comment) => comment._id.toString() === req.params.commentID,
			);
			if (commentIndex === -1) {
				res.status(404).send({
					message: `comment with ${req.params.commentID} is not found!`,
				});
			} else {
				await products.findByIdAndUpdate(
					req.params.productId,
					{
						$pull: {
							productComment: { _id: req.params.commentID },
						},
					},
					{ new: true },
				);
				res.status(204).send();
			}
		} else {
			res.status(404).send({
				message: `Product with ${req.params.productId} is not found!`,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500);
		next(error);
	}
};

/* *********************************************** */

const productEndPoints = {
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
};

export default productEndPoints;
