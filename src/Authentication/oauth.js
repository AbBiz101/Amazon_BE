import passport from 'passport';
import UserModel from '../Services/User/schema.js';
import GoogleStrategy from 'passport-google-oauth20';
import { JWTAuthenticatorForLogin } from './authenticator.js';

const googleOAuth = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `${process.env.FE_PROD_URL}/user/googleRedirect`,
	},

	async (accessToken, refreshToken, profile, passportNext) => {
		try {
			const user = await UserModel.findOne({ googleID: profile.id });
			if (user) {
				const tokens = await JWTAuthenticatorForLogin(user);
				passportNext(null, { tokens });
			} else {
				const newUser = new UserModel({
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					avatar: profile.photos[0].value,
					email: profile.emails[0].value,
					googleID: profile.id,
				});
				const saveUser = await newUser.save();
				const tokens = await JWTAuthenticatorForLogin(saveUser);
				passportNext(null, { tokens });
			}
		} catch (error) {
			passportNext(error);
		}
	},
);
passport.serializeUser(function (data, passportNext) {
	passportNext(null, data);
});

export default googleOAuth;
