import cors from 'cors';
import mongoose from 'mongoose';
import Endpoints from 'express-list-endpoints';
import express from 'express';
import {
	usersRouter,
	commentsRouter,
	productsRouter,
} from './Services/index.js';
import { errorHandler } from './errorHandler.js';

const app = express();
app.use(express.json());

/* *************************** CORS middleware  ************************************* */
const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL];

const corsOpts = {
	origin: function (origin, next) {
		if (!origin || whiteList.indexOf(origin) !== -1) {
			next(null, true);
		} else {
			next(new Error());
		}
	},
};

app.use(cors(corsOpts));

/* *************************** Endpoints  ********************************************* */
app.use('/user', usersRouter);
app.use('/product', productsRouter);
app.use('/comment', commentsRouter);

/* *************************** Error middleware  ************************************* */
app.use(errorHandler);

/* *************************** Starting the sever  ************************************* */
const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
	console.log(`Connected to Mongo`);
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
});

console.table(Endpoints(app));
