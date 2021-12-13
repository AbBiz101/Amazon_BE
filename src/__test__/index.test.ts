import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import dotenv from 'dotenv';

dotenv.config();
const request = supertest(app);

describe('Testing Jest config', () => {
	it('should pass', () => {
		expect(true).toBe(true);
	});
});

describe('Testing the app Endpoints', () => {
	beforeAll((done) => {
		console.log('This gets run before all tests in this suite');
		mongoose.connect(process.env.MONGO_URL_Test!).then(() => {
			console.log('Connected to the test database');
			done();
		});
	});

	const validProduct = {
		_id: '61b5f889b2fe8d2c62a9f1da',
		productName: 'iphone 12',
		productImg:
			'https://m.media-amazon.com/images/I/71dy3ZOKylL._AC_SX522_.jpg',
		productPrice: 120,
		productDescription:
			'Ducimus esse nihil voluptates ipsa quia unde aut aliquid inventore.',
		comments: [],
		createdAt: '2021-12-12T13:26:33.621Z',
		updatedAt: '2021-12-12T13:49:47.026Z',
		__v: 0,
	};

	const nameUpdate = {
		name: 'Test Accommodation Updated',
	};

	const validComment = {
		_id: '61b5f889b2fe8d2c62a9f1da',
		username: 'hacking_virginia_expedite.7z',
		comments: 'Dolor recusandae qui quos vel voluptates omnis sunt.',
		rating: 3,
		createdAt: '2021-12-12T13:26:33.621Z',
		updatedAt: '2021-12-12T13:49:47.026Z',
		__v: 0,
	};

	let _id: string;
	const wrongId = '999999999999999999999999';

	/* ************************************************ product endpoints ************************************************* */

	it('Endpoint-1 GET all products /Products', async () => {
		const response = await request.get('/products');
		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});

	it('Endpoint-2 Create product /Products', async () => {
		const response = await request.post('/products').send(validProduct);
		expect(response.status).toBe(201);
		expect(response.body._id.length).toBe(24);
		_id = response.body._id;
	});

	it('Endpoint-3 Create product /Products with invalid body content returns 404', async () => {
		const response = await request.post('/products').send(validComment);
		expect(response.status).toBe(404);
	});

	it('Endpoint-4 GET a product by ID /Products/:id', async () => {
		const response = await request.get('/products' + _id);
		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});

	it('Endpoint-5 GET a product by id /Products/:id with invalid id returns 404', async () => {
		const response = await request.get('/products/' + wrongId);
		expect(response.status).toBe(404);
	});

	it('Endpoint-6 UPDATE a product by id /Products/:id ', async () => {
		const response = await request.put(`/products/` + _id).send(nameUpdate);
		expect(response.status).toBe(201);
		expect(response.body).toBeDefined();
	});

	it('Endpoint-7 UPDATE a product by id /Products/:id with invalid id returns 404', async () => {
		const response = await request.put(`/products/` + wrongId).send(nameUpdate);
		expect(response.status).toBe(404);
	});

	it('Endpoint-8 DELETE a product by id /Products/:id', async () => {
		const response = await request.delete('/products/' + _id);
		expect(response.status).toBe(204);
	});

	it('Endpoint-9 DELETE a product by id /Products/:id with invalid id returns 404', async () => {
		const response = await request.delete(`/products/` + wrongId);
		expect(response.status).toBe(404);
	});

	/* ************************************************ comment endpoints ************************************************* */

	it('Endpoint-10 GET all comments of a product /Products/:pId/comment', async () => {
		const response = await request.get('/products/' + _id + '/comment');
		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});

	it('Endpoint-11 GET all comments of a product /Products/:pId/comment with invalid product id returns 404', async () => {
		const response = await request.get('/products/' + wrongId + '/comment');
		expect(response.status).toBe(404);
	});

	it('Endpoint-12 ADD comment on a product /Products/:pId/comment', async () => {
		const response = await request
			.put('/products/' + _id + '/comment')
			.send(validComment);
		expect(response.status).toBe(201);
		expect(response.body).toBeDefined();
	});

	it('Endpoint-13 ADD comment on a product /Products/:pId/comment with invalid product id returns 404', async () => {
		const response = await request
			.put('/products/' + wrongId + '/comment')
			.send(validComment);
		expect(response.status).toBe(404);
	});

	it('Endpoint-14 ADD comment on a product /Products/:pId/comment with invalid body content returns 404', async () => {
		const response = await request
			.put('/products/' + _id + '/comment')
			.send(validProduct);
		expect(response.status).toBe(404);
	});

	it('Endpoint-15 GET a comment on a product /Products/:pId/comment/commentID', async () => {
		const response = await request.get('/products/' + _id + '/comment/' + _id);
		expect(response.status).toBe(201);
		expect(response.body).toBeDefined();
	});

	it('Endpoint-16 GET a comment on a product /Products/:pId/comment/commentID with invalid product id returns 404', async () => {
		const response = await request.get(
			'/products/' + wrongId + '/comment/' + _id,
		);
		expect(response.status).toBe(404);
	});

	it('Endpoint-17 GET a comment on a product /Products/:pId/comment/commentID with invalid comment id returns 404', async () => {
		const response = await request.get(
			'/products/' + _id + '/comment/' + wrongId,
		);
		expect(response.status).toBe(404);
	});

	it('Endpoint-18 UPDATE a comment on a product /Products/:pId/comment/commentID', async () => {
		const response = await request
			.put('/products/' + _id + '/comment/' + _id)
			.send(nameUpdate);
		expect(response.status).toBe(201);
		expect(response.body).toBeDefined();
	});

	it('Endpoint-19 UPDATE a comment on a product /Products/:pId/comment/commentID with invalid product id returns 404', async () => {
		const response = await request
			.put('/products/' + wrongId + '/comment/' + _id)
			.send(nameUpdate);
		expect(response.status).toBe(404);
	});

	it('Endpoint-20 UPDATE a comment on a product /Products/:pId/comment/commentID with invalid comment id returns 404', async () => {
		const response = await request
			.put('/products/' + _id + '/comment/' + wrongId)
			.send(nameUpdate);
		expect(response.status).toBe(404);
	});

	it('Endpoint-21 DELETE a comment on a product /Products/:pId/comment/commentID', async () => {
		const response = await request.delete(
			'/products/' + _id + '/comment/' + _id,
		);
		expect(response.status).toBe(204);
	});

	it('Endpoint-22 DELETE a comment on a product /Products/:pId/comment/commentID with invalid product id returns 404', async () => {
		const response = await request.delete(
			'/products/' + wrongId + '/comment/' + _id,
		);
		expect(response.status).toBe(404);
	});

	it('Endpoint-23 DELETE a comment on a product /Products/:pId/comment/commentID with invalid comment id returns 404', async () => {
		const response = await request.delete(
			'/products/' + _id + '/comment/' + wrongId,
		);
		expect(response.status).toBe(404);
	});

	afterAll((done) => {
		mongoose.connection
			.dropDatabase()
			.then(() => {
				return mongoose.connection.close();
			})
			.then(() => {
				done();
			});
	});
});
