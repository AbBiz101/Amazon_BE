import cors from 'cors';
import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import Endpoints from 'express-list-endpoints';
import { errorHandler } from './errorHandler.js';
import usersRouter from './Services/User/index.js';
import googleOAuth from './Authentication/oauth.js';
import commentRouter from './Services/Comments/index.js';
import productsRouter from './Services/Products/index.js';
import cartsRouter from './Services/ShoppingCart/router.js';

passport.use('google', googleOAuth);

const app = express();
app.use(express.json());
app.use(passport.initialize());

/* *************************** CORS middleware  ************************************* */
const whiteList = [
	process.env.FE_LOCAL_URL,
	process.env.API_URL,
	process.env.FE_PROD_URL,
];

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
app.use('/product', commentRouter);
app.use('/shoppingCart', cartsRouter);
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
