import commentsModel from '../Comments/schema';
import createHttpError from 'http-errors';
import productsModel from './schema';
//import q2m from 'query-to-mongo';

type Comment = {
	_id: String;
	username: String;
	comments: String;
	rating: Number;
	createdAt: String;
	updatedAt: String;
	__v: Number;
};

type Product = {
	_id: String;
	productName: String;
	productImg: String;
	productPrice: Number;
	productDescription: String;
	rating: Number;
	comments: Comment;
	createdAt: String;
	updatedAt: String;
	__v: Number;
};

/* ******************** Product endpoints *************************** */

const getAllProducts = async (req: any, res: any, next: any) => {
	try {
		const allProducts = await productsModel.find();
		res.status(200).send(allProducts);
	} catch (error: any) {
		res.send(500).send({ message: error.message });
	}
};

const createProducts = async (req: any, res: any, next: any) => {
	try {
		const newProducts = new productsModel(req.body);
		const { _id } = await newProducts.save();
		res.status(201).send(_id);
	} catch (error: any) {
		next(error);
		res.send(404).send({ message: error.message });
	}
};

const getProductById = async (req: any, res: any, next: any) => {
	try {
		const id = req.params.id;
		const product = await productsModel.findById(id);
		if (product) {
			res.status(200).send(product);
		} else {
			res.status(404).send('No product found with this id.');
		}
	} catch (error: any) {
		next(error);
		res.status(500).send({ message: error.message });
	}
};

const updateProduct = async (req: any, res: any, next: any) => {
	try {
		const id = req.params.id;
		const updateProduct = await productsModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (updateProduct) {
			res.status(201).send(updateProduct);
		} else {
			res.status(404).send();
		}
	} catch (error: any) {
		next(error);
		res.send(500).send({ message: error.message });
	}
};

const deleteProduct = async (req: any, res: any, next: any) => {
	try {
		const id = req.params.id;
		const product = await productsModel.findByIdAndDelete(id);
		if (product) {
			res.status(204).send();
		} else {
			res.status(404).send();
		}
	} catch (error: any) {
		next(error);
		res.send(500).send({ message: error.message });
	}
};

/* *********************** comment endpoints ************************ */

const commentOnAProduct = async (req: any, res: any, next: any) => {
	console.log(req.params.pId, req.body);

	try {
		const productId = req.params.pId;
		const product = await productsModel.findById(productId);
		if (product) {
			await productsModel.findByIdAndUpdate(
				productId,
				{
					$push: {
						comments: req.body,
					},
				},
				{ new: true },
			);
		} else {
			// next(error)
			// res.send(404).send({ message: error.message });
			res.status(404).send(`Product with id ${productId} not found!`);
		}
	} catch (error: any) {
		// next(error);
		res.send(500).send({ message: error.message });
	}
};

const allCommentsOfAProduct = async (req: any, res: any, next: any) => {
	try {
		const id = req.params.pId;
		const product = await productsModel.findById(id);
		if (product) {
			res.send(200).send(product.comments);
		} else {
			res.status(404).send(`Product with id ${id} not found!`);;
		}
	} catch (error: any) {
		next(error);
		res.send(500).send({ message: error.message });
	}
};

const getCommentOfAProductByID = async (req: any, res: any, next: any) => {
	try {
		const productId = req.params.pId;
		const commentId = req.params.commentID;
		const product = await productsModel.findById(productId);
		if (product) {
			const comment = await commentsModel.findById(commentId);
			if (comment) {
				res.send(comment);
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
	} catch (error: any) {
		next(error);
		res.send(500).send({ message: error.message });
	}
};

const editCommentOfAProductByID = async (req: any, res: any, next: any) => {
	try {
		const productId = req.params.pId;
		const commentId = req.params.commentID;
		const product = await productsModel.findById(productId);
		if (product) {
			const commentIndex: number = product.comments
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
	} catch (error: any) {
		next(error);
		res.send(500).send({ message: error.message });
	}
};

const deleteCommentOfAProductByID = async (req: any, res: any, next: any) => {
	try {
		const productId = req.params.pId;
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
	} catch (error: any) {
		next(error);
		res.send(500).send({ message: error.message });
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
