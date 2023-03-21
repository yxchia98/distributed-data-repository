import express, { Express, Request } from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import "./services/passport";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import topicRouter from "./routes/topic";
import profileRouter from "./routes/profile";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
// import { setup } from "./services/database";
import "./services/database";
dotenv.config();

const app: Express = express();
const port: number = parseInt(<string>process.env.PORT) || 8080;
// const hostname: string = <string>process.env.HOSTNAME || "localhost";
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

app.use(`/auth`, authRouter);
app.use(`/topic`, topicRouter);
app.use(`/profile`, profileRouter);

// setup swagger api documentation page
import YAML from "yamljs";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import path from "path";
const swaggerDocument = YAML.load(path.resolve("./src/swagger.yml"));
const options: SwaggerOptions = {
    swaggerOptions: {
        supportedSubmitMethods: [],
    },
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// http and https configuration
const privateKey = fs.readFileSync("./ssl/private.key");
const certificate = fs.readFileSync("./ssl/certificate.crt");
const certificateAuthority = fs.readFileSync("./ssl/ca_bundle.crt");
const credentials = { key: privateKey, cert: certificate, ca: certificateAuthority };

// run https server
// use this in production where SSL cert is used
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// if you want to revert back to http-based server
// WARNING: Google OAuth wont work with http-based servers on non-localhost
// const httpServer = http.createServer(app);
// httpServer.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// app.listen(port, () => {
//     console.log(`listening on port: ${port}`);
// });
