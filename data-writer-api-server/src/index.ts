import express, { Express } from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import "./services/passport";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import writerRouter from "./routes/writer";
dotenv.config();

const app: Express = express();
const port: number = parseInt(<string>process.env.PORT) || 8080;
app.use(
    session({
        name: "session",
        secret: "cat",
    })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors());
const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(express.json());

app.use(`/auth`, authRouter);
app.use(`/writer`, writerRouter);

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});
