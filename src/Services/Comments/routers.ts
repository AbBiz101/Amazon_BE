import commentsModel from './schema';
import createHttpError from 'http-errors';

const getAllComments = async (req: any, res: any, next: any) => {
	try {
		const allComment = await commentsModel.find();
		res.send(allComment);
	} catch (error) {
		next(error);
	}
};

const createComment = async (req: any, res: any, next: any) => {
	try {
		const newComment = new commentsModel(req.body);
		const { _id } = await newComment.save();
		console.log(newComment);
		res.status(200).send(_id);
	} catch (error) {
		next(error);
	}
};

const getCommentById = async (req: any, res: any, next: any) => {
	try {
		const id = req.params.id;
		const comment = await commentsModel.findById(id);
		if (comment) {
			res.send(comment);
		}
	} catch (error) {
		next(error);
	}
};

const updateComment = async (req: any, res: any, next: any) => {
	try {
		const id = req.params.id;
		const updateComment = await commentsModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (updateComment) {
			res.send(updateComment);
		} else {
			next(createHttpError(404, `Comment with id ${id} not found!`));
		}
	} catch (error) {
		next(error);
	}
};

const deleteComment = async (req: any, res: any, next: any) => {
	try {
		const id = req.params.id;
		const deleteComment = await commentsModel.findByIdAndDelete(id);
		if (deleteComment) {
			res.status(200).send();
		} else {
			next(createHttpError(404, `Comment with id ${id} not found!`));
		}
	} catch (error) {
		next(error);
	}
};

const commentEndPoint = {
	getAllComments,
	createComment,
	getCommentById,
	updateComment,
	deleteComment,
};

export default commentEndPoint;