import cors from 'cors';
import { app } from './app';
import mongoose from 'mongoose';
import Endpoints from 'express-list-endpoints';

process.env.TS_NODE_DEV && require('dotenv').config();

/* *************************** CORS middleware  ************************************* */
const whiteList = [process.env.FE_LOCAL_URL!, process.env.FE_PROD_URL!];

const corsOpts = {
	origin: function (origin: any, next: any) {
		if (!origin || whiteList.indexOf(origin) !== -1) {
			next(null, true);
		} else {
			next(new Error());
		}
	},
};
app.use(cors(corsOpts));

/* *************************** Starting the sever  ************************************* */
const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION!).then(() => {
	console.log(`Connected to Mongo`);
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
});

console.table(Endpoints(app));
