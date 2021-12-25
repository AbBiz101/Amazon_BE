import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = new mongoose.Schema(
	{
		productName: { type: String, required: true },
		productImg: { type: String, required: true },
		productPrice: { type: Number, required: true },
		productDescription: { type: String, required: true },
		productCategory: { type: String, required: true },
		comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
	},
	{
		timestamps: true,
	},
);

export default model('products', ProductSchema);
