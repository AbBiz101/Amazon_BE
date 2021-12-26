import createHttpError from 'http-errors';
import q2m from 'query-to-mongo';
import Comments from './schema.js';
import products from '../Products/schema.js';


const getAllCommentsOfAProduct = async (req, res, next) => {
	try {
		const pID = req.params.productId;
		const product = await products.findById(pID);
		res.send(product.productComment);
	} catch (error) {
		next(error);
	}
};

const createComment = async (req, res, next) => {
	try {
		console.log();
		const pID = req.params.productId;
		const newComment = new Comments(req.body);
		const product = await products.findById(pID);
		const { _id } = await newComment.save();
		if (product) {
			const prod = await products.findByIdAndUpdate(pID, {
				$push: { productComment: _id },
			});

			console.log(newComment, prod);
			res.status(200).send(_id);
		} else {
			res.status(400).send('no product with this id');
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};

const getCommentById = async (req, res, next) => {
	try {
		const pID = req.params.productId;
		const cID = req.params.commentId;
		const prod = await products.findById(pID);
		if (prod) {
			const com = await Comments.findById(cID);
			if (com) {
				res.send(com);
			} else {
				res.status(400).send('no comment with this id');
			}
		} else {
			res.status(400).send('no product with this id');
		}
	} catch (error) {
		next(error);
	}
};

const updateComment = async (req, res, next) => {
	try {
		const pID = req.params.productId;
		const cID = req.params.commentId;
		const prod = await products.findById(pID);
		if (prod) {
			const com = await Comments.findByIdAndUpdate(cID);
			if (com) {
				const newCom = await Comments.findByIdAndUpdate(cID, req.body, {
					new: true,
				});
				res.send(newCom);
			} else {
				res.status(400).send('no comment with this id');
			}
		} else {
			res.status(400).send('no product with this id');
		}
	} catch (error) {
		next(error);
	}
};

const deleteComment = async (req, res, next) => {
	try {
		const pID = req.params.productId;
		const cID = req.params.commentId;
		const prod = await products.findByIdAndUpdate(pID, {
			$pull: { productComment: cID },
		});

		if (prod) {
			const com = await Comments.findByIdAndDelete(cID);
			if (com) {
				res.status(200).send();
			} else {
				res.status(400).send('no comment with this id');
			}
		} else {
			res.status(400).send('no product with this id');
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};

const commentEndPoints = {
	getAllCommentsOfAProduct,
	createComment,
	getCommentById,
	updateComment,
	deleteComment,
};

export default commentEndPoints;
