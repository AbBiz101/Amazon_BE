import cors from 'cors';
import express from 'express';
import Endpoints from 'express-list-endpoints';
import productsRouter from './Services/Products/index';
import mongoose from 'mongoose';
import {
	notFoundHandler,
	badRequestHandler,
	unAuthorizedHandler,
	genericErrorHandler,
} from './errorHandler';

process.env.TS_NODE_DEV && require('dotenv').config();

const server = express();

/* *************************** CORS middleware  ************************************* */
// const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL];
// const corsOpts = {
// 	origin: function (origin: any, next: any) {
// 		if (!origin || whiteList.indexOf(origin) !== -1) {
// 			next(null, true);
// 		} else {
// 			next(new Error());
// 		}
// 	},
// };
// server.use(cors(corsOpts));
server.use(express.json());
server.use('/products', productsRouter);
/* *************************** Endpoints  ********************************************* */

/* *************************** Error middleware  ************************************* */
server.use(badRequestHandler);
server.use(unAuthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

/* *************************** Starting the sever  ************************************* */
const port = process.env.PORT;
console.table(Endpoints(server));
server.listen(port, async () => {
	try {
		mongoose.connect(process.env.MONGO_CONNECTION!, {
			//  useNewUrlParser: true,
			//  useUnifiedTopology: true,
		});
		console.log(`✅ Server is running on ${port}  and connected to db`);
	} catch (error) {
		console.log('Db connection is failed ', error);
	}
});

server.on('error', (error) =>
	console.log(`❌ Server is not running due to : ${error}`),
);
