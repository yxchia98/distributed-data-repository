import express, { Express, Request } from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import "./services/passport";
import dotenv from "dotenv";
import "./services/database";
import profileRouter from "./routes/profile";
import authRouter from "./routes/auth";
dotenv.config();

const app: Express = express();
const port: number = parseInt(<string>process.env.PORT) || 8080;
// app.use(
//     session({
//         name: "session",
//         secret: "cat",
//     })
// );
app.use(
    cookieSession({
        name: "session",
        keys: ["datasg"],
        maxAge: 24 * 60 * 60 * 100,
    })
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request: Express.Request, response: Express.Response, next) {
    if (request.session && !request.session.regenerate) {
        // @ts-ignore
        request.session.regenerate = (cb) => {
            // @ts-ignore
            cb();
        };
    }
    if (request.session && !request.session.save) {
        // @ts-ignore
        request.session.save = (cb) => {
            // @ts-ignore
            cb();
        };
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());
// app.use(cors());
const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// initialize connection to pgsql
// setup();

app.use(express.json());

app.use(`/profile`, profileRouter);
app.use(`/auth`, authRouter);

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});
