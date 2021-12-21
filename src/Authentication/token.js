import jwt from 'jsonwebtoken';

export const JWTTokenGenerator = (payload) =>
	new Promise((resolve, reject) =>
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: '1 week' },
			(err, token) => {
				if (err) reject(err);
				else resolve(token);
			},
		),
	);

export const JWTverifier = (token) =>
	new Promise((res, rej) =>
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			if (err) rej(err);
			else res(decodedToken);
		}),
	);

export const JWTRefreshTokenGenerator = (payload) =>
	new Promise((resolve, reject) =>
		jwt.sign(
			payload,
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: '1 week' },
			(err, token) => {
				if (err) reject(err);
				else resolve(token);
			},
		),
	);

export const refreshJWTverifier = (token) =>
	new Promise((res, rej) =>
		jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
			if (err) rej(err);
			else res(decodedToken);
		}),
	);
