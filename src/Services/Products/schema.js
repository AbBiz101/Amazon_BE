import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = new Schema(
	{
		productName: { type: String, required: true },
		productImg: { type: String, required: true },
		productPrice: { type: Number, required: true },
		productDescription: { type: String, required: true },
		rating: { type: Number, required: true },

		comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
	},
	{
		timestamps: true,
	},
);

export default model('products', ProductSchema);
