import express from 'express';
import passport from 'passport';
import endpoints from './router.js';
import {
	JWTAuthentication,
	adminAuthentication,
} from '../../Authentication/authenticator.js';

const {
	login,
	getPDF,
	getUser,
	editUser,
	sendUser,
	createUser,
	deleteUser,
	getUserAdmin,
	editUserAdmin,
	googleRedirect,
	purchasedEmail,
	getRefreshToken,
	getAllUserAdmin,
	deleteUserAdmin,
} = endpoints;

const usersRouter = express.Router();

/**************************************** LOGIN/REGISTER *************************************************/
usersRouter.route('/register').post(createUser);
usersRouter.route('/refresh').post(getRefreshToken);
usersRouter.route('/login').post(login);

/**************************************** OAUTH *************************************************/

usersRouter.get(
	'/googleLogin',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	}),
);

usersRouter.get(
	'/googleRedirect',
	passport.authenticate('google'),
	googleRedirect,
);
usersRouter.get('/getUser', JWTAuthentication, sendUser);
/**************************************** USER *************************************************/
usersRouter
	.route('/me')
	.get(JWTAuthentication, getUser)
	.put(JWTAuthentication, editUser)
	.delete(JWTAuthentication, deleteUser);

usersRouter.route('/me/cart').post(JWTAuthentication, purchasedEmail);

/**************************************** ADMIN *************************************************/
usersRouter
	.route('/')
	.get(JWTAuthentication, adminAuthentication, getAllUserAdmin);
usersRouter
	.route('/:id')
	.get(JWTAuthentication, adminAuthentication, getUserAdmin)
	.put(JWTAuthentication, adminAuthentication, editUserAdmin)
	.delete(JWTAuthentication, adminAuthentication, deleteUserAdmin);

usersRouter.route('/basket/getPdf', getPDF);

export default usersRouter;
