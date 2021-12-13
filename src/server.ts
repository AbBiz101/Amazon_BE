import cors from 'cors';
import Endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import { app } from './app';

process.env.TS_NODE_DEV && require('dotenv').config();



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




/* *************************** Starting the sever  ************************************* */
const port = process.env.PORT;

app.listen(port, async () => {
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

app.on('error', (error) =>
	console.log(`❌ Server is not running due to : ${error}`),
);
console.table(Endpoints(app));
