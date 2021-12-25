import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartSchema = new Schema(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		status: { type: String, required: true, enum: ['active', 'paid'] },
		products: [
			{
				quantity: Number,
				name: String,
				description: String,
				brand: String,
				imageUrl: String,
				price: Number,
				category: String,
			},
		],
	},
	{
		timestamps: true,
	},
);

export default model('Cart', cartSchema);
