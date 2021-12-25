import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const commentSchema = new mongoose.Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user' },
		comments: { type: String, required: true },
		rating: {
			type: Number,
			min: [1, 'Minimum rate is 1'],
			max: [5, 'Maximum rate is 5'],
			default: 1,
		},
	},
	{
		timestamps: true,
	},
);

const ProductSchema = new mongoose.Schema(
	{
		productName: { type: String, required: true },
		productImg: { type: String, required: true },
		productPrice: { type: Number, required: true },
		productDescription: { type: String, required: true },
		productCategory: { type: String, required: true },
		productComment: { default: [], type: [commentSchema] },
	},
	{
		timestamps: true,
	},
);

export default model('products', ProductSchema);
