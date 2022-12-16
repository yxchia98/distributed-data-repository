import { Strategy } from "passport-google-oauth2";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

const GoogleStrategy = Strategy;
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET;
passport.use(
    new GoogleStrategy(
        {
            clientID: <string>process.env.GOOGLE_CLIENT_ID,
            clientSecret: <string>process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: <string>process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        function (
            request: any,
            accessToken: any,
            refreshToken: any,
            profile: any,
            done: any
        ) {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user: Express.User, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done: any) => {
    done(null, user);
});
