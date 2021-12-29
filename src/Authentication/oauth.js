import passport from 'passport';
import UserModel from '../Services/User/schema.js';
import GoogleStrategy from 'passport-google-oauth20';
import { JWTAuthenticatorForLogin } from './authenticator.js';

const googleOAuth = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `${process.env.API_URL}/user/googleRedirect`,
	},

	async (accessToken, refreshToken, profile, passportNext) => {
		try {
			console.log(profile);
			const user = await UserModel.findOne({ googleID: profile.id });
			if (user) {
				//if the user exist
				const tokens = await JWTAuthenticatorForLogin(user);
				passportNext(null, { tokens });
			} else {
				//if the user doesn't exist create it using the google info
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
			console.log(error);
			passportNext(error);
		}
	},
);
passport.serializeUser(function (data, passportNext) {
	passportNext(null, data);
});

export default googleOAuth;
