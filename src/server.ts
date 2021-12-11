import cors from 'cors';
import express from 'express';
import Endpoints from 'express-list-endpoints';
import {
	notFoundHandler,
	badRequestHandler,
	unAuthorizedHandler,
	genericErrorHandler,
} from './errorHandler.js';

const server = express();

/* *************************** CORS middleware  ************************************* */
const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL];
const corsOpts = {
	origin: function (origin, next) {
		if (!origin || whiteList.indexOf(origin) !== -1) {
			next(null, true);
		} else {
			next(new Error(404, 'CORS ERROR'));
		}
	},
};
server.use(cors(corsOpts));
server.use(express.json());

/* *************************** Endpoints  ********************************************* */

/* *************************** Error middleware  ************************************* */
server.use(badRequestHandler);
server.use(unAuthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

/* *************************** Starting the sever  ************************************* */
const port = process.env.PORT;
console.table(Endpoints(server));
server.listen(port, () => {
	console.log('server running-', port);
});
