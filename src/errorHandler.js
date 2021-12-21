export const errorHandler = (err, req, res, next) => {
	switch (err.status) {
		case 400:
			return res.status(400).send({ message: err.errorsList });
		case 401:
			return res.status(401).send('Unauthorized User');
		case 404:
			return res.status(404).send({ message: err.message });
		case 500:
			return res.status(500).send({ message: err.message });
		default:
			return;
	}
};
