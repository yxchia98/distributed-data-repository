import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import "../services/passport";
import dotenv from "dotenv";
import multer from "multer";
import { ReadAccess } from "../models/read_access";
dotenv.config();

const router = express.Router();
const upload = multer();
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    req.user ? next() : res.sendStatus(401);
};

const isHighestPrivilege = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // @ts-ignore
    req.user && req.user.email == "yxchia98@gmail.com"
        ? next()
        : res.sendStatus(401);
};

/*-------------------- AUTH API START ---------------*/

/**
 * Endpoint to check if current session is logged in
 */
router.get("/login/success", (req: Request, res: Response) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Loged In",
            // @ts-ignore
            user: req.user.id,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

/**
 *
 */
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

/**
 * OAuth2 callback endpoint
 */
router.get(
    "/google/callback",
    passport.authenticate("google", {
        // successRedirect: <string>process.env.CLIENT_URL,
        successRedirect: "http://localhost:3000",
        failureRedirect: "/auth/failure",
    })
);

/**
 * OAuth2 failure callback
 */
router.get("/failure", (req, res) => {
    res.status(401).send({
        error: true,
        message: "Log in failure",
    });
});

router.get("/protected", isLoggedIn, (req: Request, res: Response) => {
    console.log(req.user);
    if (req.user) {
        const currUser: Express.User = req.user;
        res.status(200).send({
            error: false,
            message: "Success",
            data: currUser,
        });
    }
});

router.get("/topSecret", isHighestPrivilege, (req: Request, res: Response) => {
    console.log(req.user);
    if (req.user) {
        const currUser: Express.User = req.user;
        res.status(200).send({
            error: false,
            message: "Success",
            data: currUser,
        });
    }
});
/**
 * logout endpoint
 */
router.get("/logout", (req: Request, res: Response) => {
    req.logout((err: any) => {
        if (err) {
            res.status(400).send({ error: true, message: "Logout error" });
        }
        // req.session?.destroy((err: any) => {});
    });
    res.redirect(process.env.CLIENT_URL);
});

/**
 * Add new read access endpoint
 */
router.post("/read", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    if (!(req.body.user_id && req.body.topic_id)) {
        res.status(404).send({
            error: true,
            message: "Error, compulsory fields not set",
        });
        return;
    }
    try {
        // check if access already exists
        // cannot use findByPk for composite keys, must use findOne instead
        const queryRead = await ReadAccess.findOne({
            where: {
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            },
        });
        if (!queryRead) {
            console.log("found!");
            // insert access record
            const insertRead = await ReadAccess.create({
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            });
            res.status(200).send({
                error: false,
                message: "successfully created!",
            });
        } else {
            res.status(404).send({
                error: true,
                message: `Error, ${req.body.user_id} already has the requested access`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: true,
            message: "Error in granting read access",
        });
    }
});

/**
 * Delete read access endpoint
 */
router.delete(
    "/read",
    upload.none(),
    async (req: Request, res: Response) => {}
);

/**
 * Add new write access endpoint
 */
router.post("/write", upload.none(), async (req: Request, res: Response) => {});

/**
 * Delete write access endpoint
 */
router.delete(
    "/write",
    upload.none(),
    async (req: Request, res: Response) => {}
);

export default router;
