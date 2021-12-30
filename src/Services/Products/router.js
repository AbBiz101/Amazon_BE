import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import comments from '../Comments/schema.js';
import createHttpError from 'http-errors';
import products from './schema.js';
import q2m from 'query-to-mongo';

/* ******************** Product endpoints *************************** */
const createImg = async (req, res, next) => {
	try {
		const imageURL = req.file.path;
		if (imageURL) {
			res.send({data:imageURL,obj:1212});
		} else {
			console.log('image uploading failed');
		}
	} catch (error) {
		console.log(error);
	}
};

const getAllProducts = async (req, res, next) => {
	try {
		const mongoQuery = q2m(req.query);
		const total = await products.countDocuments(mongoQuery.criteria);
		const allProducts = await products
			.find(mongoQuery.criteria)
			.limit(mongoQuery.options.limit)
			.skip(mongoQuery.options.skip)
			.sort(mongoQuery.options.sort);
		console.log(21211);

		res.send({
			links: mongoQuery.links('/product', total),
			pageTotal: Math.ceil(total / mongoQuery.options.limit),
			total,
			allProducts,
		});
	} catch (error) {
		res.status(500).send();
		next(error);
	}
};

const createProducts = async (req, res, next) => {
	try {
		const newProducts = new products(req.body);
		const { _id } = await newProducts.save();
		res.status(201).send(_id);
	} catch (error) {
		console.log(error);
		res.status(500).send();
		next(error);
	}
};

const getProductById = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await products.findById(id);
		console.log(product);
		if (product) {
			res.status(200).send(product);
		} else {
			res.status(404).send(`No product found with this id-${id}.`);
		}
	} catch (error) {
		res.status(500).send();
		next(error);
	}
};

const updateProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const updateProduct = await products.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (updateProduct) {
			res.status(201).send(updateProduct);
		} else {
			res.status(404).send();
		}
	} catch (error) {
		res.send(500).send();
		next(error);
	}
};

const deleteProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const product = await products.findByIdAndDelete(id);
		if (product) {
			res.status(204).send();
		} else {
			res.status(404).send();
		}
	} catch (error) {
		res.send(500).send();
		next(error);
	}
};

const productEndPoints = {
	createImg,
	updateProduct,
	deleteProduct,
	getAllProducts,
	createProducts,
	getProductById,
};

export default productEndPoints;
