import express from 'express';
import productsRouter from './Services/Products/index';
import {
	notFoundHandler,
	badRequestHandler,
	unAuthorizedHandler,
	genericErrorHandler,
} from './errorHandler';

const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
	res.send({ message: 'Test successful' });
});


/* *************************** Endpoints  ********************************************* */
app.use('/products', productsRouter);


/* *************************** Error middleware  ************************************* */
app.use(badRequestHandler);
app.use(unAuthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

export { app };
