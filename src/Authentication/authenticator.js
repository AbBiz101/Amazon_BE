import atob from 'atob';
import createError from 'http-errors';
import UserModel from '../Services/User/schema.js';
import {
	JWTverifier,
	JWTTokenGenerator,
	JWTRefreshTokenGenerator,
	refreshJWTverifier,
} from './token.js';

/*****************************************BASIC Auth*******************************************************/

export const basicAuthentication = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			next(createError(401, 'Credentials in Authorization header is missing.'));
		} else {
			const base64 = req.headers.authorization.replace('Basic ', '');
			const decodedBase64 = atob(base64);
			const [email, password] = decodedBase64.split(':');
			const user = await UserModel.checkCredentials(email, password);
			if (user) {
				req.user = user;
				next();
			} else {
				next(createError(401, 'User name or password is incorrect.'));
			}
		}
	} catch (error) {
		console.log(error);
	}
};

export const adminAuthentication = (req, res, next) => {
	if (req.user.role === 'ADMIN') {
		next();
	} else {
		next(createError(403, 'Authorized admin only.'));
	}
};

/*****************************************JWT Auth*******************************************************/

export const JWTAuthenticatorForLogin = async (user) => {
	//generate both tokens and send it to FE + save the second token in the DB
	const accessToken = await JWTTokenGenerator({ _id: user._id });
	const refreshToken = await JWTRefreshTokenGenerator({ _id: user._id });
	user.refreshToken = refreshToken;
	await user.save();
	return { accessToken, refreshToken };
};

export const JWTAuthentication = async (req, res, next) => {
	if (req.headers.authorization) {
		try {
			//get the token
			const token = req.headers.authorization.replace('Bearer ', '');
			//using the function from tools verify the token with the Signature
			const decodedToken = await JWTverifier(token);
			const user = await UserModel.findById(decodedToken._id);
			if (user) {
				req.user = user;
				next();
			} else {
				next(createError(401, 'User dose not exist'));
			}
		} catch (error) {
			next(createError(401, 'Token not valid!'));
		}
	} else {
		next(createError(401, 'Please provide a token.'));
	}
};

export const verifyRefreshTokenAndNewTokens = async (currentRefreshToken) => {
	try {
		const decodeRefreshToken = await refreshJWTverifier(currentRefreshToken);
		const user = await UserModel.findById(decodeRefreshToken._id);

		if (!user) throw new createError(404, 'User not found');

		if (user.refreshToken && user.refreshToken === currentRefreshToken) {
			const { accessToken, refreshToken } = await JWTAuthenticatorForLogin(
				user,
			);
			return { accessToken, refreshToken };
		} else {
			next(createError(401, 'Invalid token'));
		}
	} catch (error) {
		next(error);
	}
};
