import commentEndPoints from './router.js';
import express from 'express';
const {
	getAllCommentsOfAProduct,
	createComment,
	getCommentById,
	updateComment,
	deleteComment,
} = commentEndPoints;

const commentRouter = express.Router();

commentRouter
	.route('/:productId/comments')
	.get(getAllCommentsOfAProduct)
	.post(createComment);
commentRouter
	.route('/:productId/comments/:commentId')
	.get(getCommentById)
	.put(updateComment)
	.delete(deleteComment);

export default commentRouter;
