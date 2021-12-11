export const badRequestHandler = (err: any, req: any, res: any, next: any) => {
	if (err.status === 400) {
		res.status(400).send({ message: err.errorsList || 'Bad request' });
	} else {
		next(err);
	}
};

export const unAuthorizedHandler = (
	err: any,
	req: any,
	res: any,
	next: any,
) => {
	if (err.status === 401) {
		res.status(401).send({ message: 'Unauthorized User' });
	} else {
		next(err);
	}
};

export const notFoundHandler = (err: any, req: any, res: any, next: any) => {
	if (err.status === 404) {
		res.status(404).send({ message: err.message || 'Page not found' });
	} else {
		next(err);
	}
};

export const genericErrorHandler = (
	err: any,
	req: any,
	res: any,
	next: any,
) => {
	res.status(500).send({ message: err.message });
};
