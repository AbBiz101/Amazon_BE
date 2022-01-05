import fs from 'fs-extra';
import User from './schema.js';
import q2m from 'query-to-mongo';
import { sendEmail } from './tools.js';
import createHttpError from 'http-errors';
import { JWTAuthenticatorForLogin } from '../../Authentication/authenticator.js';
import { getPDFReadableStream } from './tools.js';

const createUser = async (req, res, next) => {
	try {
		const newUser = await new User(req.body).save();
		delete newUser._doc.password;
		delete newUser._doc.__v;
		res.status(201).send(newUser);
	} catch (error) {
		console.log(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.checkCredentials(email, password);
		if (user) {
			const { accessToken, refreshToken } = await JWTAuthenticatorForLogin(
				user,
			);
			res.send({ refreshToken, accessToken, user });
		} else {
			next(createHttpError(401, 'User not found'));
		}
	} catch (error) {
		next(error);
	}
};

/**************************************** REFRESH TOKEN *************************************************/
const getRefreshToken = async (req, res, next) => {
	try {
		const { currentRefreshToken } = req.body;
		const { accessToken, refreshToken } = await verifyRefreshTokenAndNewTokens(
			currentRefreshToken,
		);
		res.send({ refreshToken, accessToken });
	} catch (error) {
		next(createHttpError(401, 'User not found'));
	}
};

/**************************************** OAUTH *************************************************/
const googleRedirect = async (req, res, next) => {
	try {
		res.redirect(
			`${process.env.FE_LOCAL_URL}?accessToken=${req.user.tokens.accessToken}&refreshToken=${req.user.tokens.refreshToken}`,
		);
	} catch (error) {
		next(error);
	}
};

/**************************************** USER *************************************************/
const getUser = async (req, res, next) => {
	try {
		res.status(200).send(req.user);
	} catch (error) {
		next(error);
	}
};

const editUser = async (req, res, next) => {
	try {
		const id = req.user._id;
		const user = await User.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (user) {
			res.send(user);
		} else {
			res.send('error updting user');
		}
	} catch (error) {
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const id = req.user._id;
		const user = await User.findByIdAndDelete();
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

/**************************************** ADMIN *************************************************/
const getAllUserAdmin = async (req, res, next) => {
	try {
		const mongoQuery = q2m(req.query);
		const total = await products.countDocuments(mongoQuery.criteria);
		const users = await User.find(mongoQuery.criteria)
			.limit(mongoQuery.options.limit)
			.skip(mongoQuery.options.skip)
			.sort(mongoQuery.options.sort);
		res.send({
			links: mongoQuery.links('/user', total),
			pageTotal: Math.ceil(total / mongoQuery.options.limit),
			total,
			users,
		});
	} catch (error) {
		next(error);
	}
};

const getUserAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		delete users._doc.password;
		delete users._doc.__v;
		res.send(user);
	} catch (error) {
		next(error);
	}
};

const editUserAdmin = async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
};

const deleteUserAdmin = async (req, res, next) => {
	try {
		await req.user.findByIdAndDelete();
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

const getPDF = (req, res, next) => {
	try {
		res.setMeader('Content-Disposition', 'attachment; filename=bill.pdf');
		source = req.body;
		const destination = res;
	} catch (error) {}
};

const purchasedEmail = async (req, res, next) => {
	try {
		const { email } = req.user;
		const body = req.body;
		const data = body.cart[0].productName;
		const data1 = body.cart[0].productPrice;
		const data2 = body.cart[0].productImg;

		const path = await getPDFReadableStream(createdProduct);
		const attachment = fs.readFileSync(path).toString('base64');
		await sendEmail(email, attachment);
		res.status(201).send(createdProduct);
	} catch (error) {
		console.log(error);
	}
};





const sendUser = async (req, res, next) => {
	try {
		console.log(req.user);
		res.send(req.user);
	} catch (error) {
		console.log(error);
	}
};

const userEndpoints = {
	login,
	getPDF,
	getUser,
	editUser,
	sendUser,
	deleteUser,
	createUser,
	getUserAdmin,
	editUserAdmin,
	googleRedirect,
	purchasedEmail,
	getRefreshToken,
	getAllUserAdmin,
	deleteUserAdmin,
};

export default userEndpoints;
