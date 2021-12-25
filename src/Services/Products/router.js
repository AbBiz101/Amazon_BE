import comments from '../Comments/schema.js';
import createHttpError from 'http-errors';
import products from './schema.js';
//import q2m from 'query-to-mongo';

/* ******************** Product endpoints *************************** */

const getAllProducts = async (req, res, next) => {
	try {
		const allProducts = await productsModel.find();
		res.status(200).send(allProducts);
	} catch (error) {
		res.send(500).send({ message: error.message });
	}
};


const createProducts = async (req, res, next) => {
	try {
		const newProducts = new productsModel(req.body);
		const { _id } = await newProducts.save();
		res.status(201).send(_id);
	} catch (error) {
		next(error);
		// res.send(404).send({ message: error.message });
	}
};

const getProductById = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await productsModel.findById(id);
		if (product) {
			res.status(200).send(product);
		} else {
			res.status(404).send('No product found with this id.');
		}
	} catch (error) {
		next(error);
		// res.status(500).send({ message: error.message });
	}
};

const updateProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const updateProduct = await productsModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (updateProduct) {
			res.status(201).send(updateProduct);
		} else {
			res.status(404).send();
		}
	} catch (error) {
		next(error);
		// res.send(500).send({ message: error.message });
	}
};

const deleteProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await productsModel.findByIdAndDelete(id);
		if (product) {
			res.status(204).send();
		} else {
			res.status(404).send();
		}
	} catch (error) {
		next(error);
		// res.send(500).send({ message: error.message });
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
		console.log(error);
		res.send(500).send({ message: error.message });
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
		next(error);
		//  res.send(500).send({ message: error.message });
	}
};

const getCommentOfAProductByID = async (req, res, next) => {
	console.log(32)
	try {
		const productId = req.params.productId;
		const commentId = req.params.commentID;
		const product = await products.findById(req.params.productId);
		
		console.log(productId, commentId, product);
		if (product) {
			const commentIndex = product.productComment.findIndex(
				(comment) => comment._id.toString() === req.params.commentID,
			);
			console.log(product, commentIndex);
			if (commentIndex === -1) {
				res.status(404)
			} else {
				res.send(commentIndex);
				// res
				// 	.status(404)
				// 	.send({ message: `Comment with ${commentId} is not found!` });
			}
		} else {
			// res.status(404)
console.log("error");
				// .send({ message: `Product with ${productId} is not found!` });
		}
	} catch (error) {
		console.log(error)
		// next(error);
		// res.status(500).send({ message: error.message });
	}
};

const editCommentOfAProductByID = async (req, res, next) => {
	try {
		const productId = req.params.productId;
		const commentId = req.params.commentID;
		const product = await productsModel.findById(productId);
		if (product) {
			const commentIndex = product.comments
				.findByIndex
				// comment => comment._id.toString() === commentId,
				();
			if (commentIndex) {
			} else {
				res
					.status(404)
					.send({ message: `Comment with ${commentId} is not found!` });
			}
		} else {
			res
				.status(404)
				.send({ message: `Product with ${productId} is not found!` });
		}
	} catch (error) {
		next(error);
		// res.status(500).send({ message: error.message });
	}
};

const deleteCommentOfAProductByID = async (req, res, next) => {
	try {
		const productId = req.params.productId;
		const commentId = req.params.commentID;
		const product = await productsModel.findById(productId);
		if (product) {
			const comment = product.comments.findById(commentId);
			if (comment) {
				await productsModel.findByIdAndDelete(
					productId,
					{
						$pull: {
							comments: { _id: commentId },
						},
					},
					//{ new: true },
				);
			} else {
				res
					.status(404)
					.send({ message: `Comment with ${commentId} is not found!` });
			}
		} else {
			res
				.status(404)
				.send({ message: `Product with ${productId} is not found!` });
		}
	} catch (error) {
		next(error);
		// res.send(500).send({ message: error.message });
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
