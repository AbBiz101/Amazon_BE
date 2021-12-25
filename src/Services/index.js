// import express from 'express';
// import passport from 'passport';
// import {
// 	JWTAuthentication,
// 	adminAuthentication,
// } from '../Authentication/authenticator.js';
// import userEndpoints from './User/router.js';
// import productEndPoints from './Products/router.js';

// const usersRouter = express.Router();
// const productsRouter = express.Router();


// const {
// 	login,
// 	getUser,
// 	editUser,
// 	createUser,
// 	deleteUser,
// 	getUserAdmin,
// 	googleRedirect,
// 	editUserAdmin,
// 	getRefreshToken,
// 	getAllUserAdmin,
// 	deleteUserAdmin,
// } = userEndpoints;

// const {
// 	updateProduct,
// 	deleteProduct,
// 	getAllProducts,
// 	createProducts,
// 	getProductById,
// 	commentOnAProduct,
// 	allCommentsOfAProduct,
// 	getCommentOfAProductByID,
// 	editCommentOfAProductByID,
// 	deleteCommentOfAProductByID,
// } = productEndPoints;

// /*************************************************************************** USER ENDPOINTS *************************************************************************/
// usersRouter.route('/register').post(createUser);

// usersRouter.route('/refresh').post(getRefreshToken);

// usersRouter.route('/login').post(login);
// /**************************************** OAUTH *************************************************/
// usersRouter.get(
// 	'/googleLogin',
// 	passport.authenticate('google', {
// 		scope: ['profile', 'email'],
// 	}),
// );

// usersRouter.get(
// 	'/googleRedirect',
// 	passport.authenticate('google'),
// 	googleRedirect,
// );
// /**************************************** USER *************************************************/
// usersRouter
// 	.route('/me')
// 	.get(JWTAuthentication, getUser)
// 	.put(JWTAuthentication, editUser)
// 	.delete(JWTAuthentication, deleteUser);
// /**************************************** ADMIN *************************************************/
// usersRouter
// 	.route('/')
//     .get(JWTAuthentication, adminAuthentication, getAllUserAdmin);
    
// usersRouter
// 	.route('/:id')
// 	.get(JWTAuthentication, adminAuthentication, getUserAdmin)
// 	.put(JWTAuthentication, adminAuthentication, editUserAdmin)
// 	.delete(JWTAuthentication, adminAuthentication, deleteUserAdmin);
// /*************************************************************************** USER ENDPOINTS *************************************************************************/




// /*************************************************************************** PRODUCT ENDPOINTS **********************************************************************/
// productsRouter.route('/').post(createProducts).get(getAllProducts);

// productsRouter
// 	.route('/:productId')
// 	.put(updateProduct)
// 	.get(getProductById)
//     .delete(deleteProduct);
    
// productsRouter
// 	.route('/:productId/comment')
// 	.put(commentOnAProduct)
// 	.get(allCommentsOfAProduct);
    
// productsRouter
// 	.route('/:productId/comment/:commentID')
// 	.get(getCommentOfAProductByID)
// 	.put(editCommentOfAProductByID)
// 	.delete(deleteCommentOfAProductByID);
// /*************************************************************************** PRODUCT ENDPOINTS *********************************************************************/

// export { usersRouter,  productsRouter };
