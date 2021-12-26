import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new mongoose.Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user' },
		comment: { type: String, required: true },
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

export default model('Comments', commentSchema);
