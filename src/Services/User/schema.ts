import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUsers {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: string;
	_id: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: IUsers;
		}
	}
}

const { Schema, model } = mongoose;

interface UserModel extends Model<IUsers, UserModel> {
	checkCredentials(email: string, password: string): any;
}

export const UserSchema = new Schema<IUsers>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, default: 'USER' },
	},
	{
		timestamps: true,
	},
);

UserSchema.pre<any>('save', async function (next) {
	const user = this;
	const password = user.password;
	if (user.isModified('password')) {
		const hashed = await bcrypt.hash(password, 10);
		user.password = hashed;
	}
	next();
});

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.__v;
	return userObj;
};

UserSchema.statics.checkCredentials = async function (email, passWord) {
	try {
		const user = await this.findOne({ email });
		if (user) {
			const matchedUser = await bcrypt.compare(passWord, user.password);
			if (matchedUser) {
				return user;
			} else {
				return null;
			}
		} else {
			return null;
		}
	} catch (error) {
		console.log(error);
	}
};

export default model('User', UserSchema);

