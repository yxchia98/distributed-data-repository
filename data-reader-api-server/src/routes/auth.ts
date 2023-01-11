import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import "../services/passport";
import dotenv from "dotenv";
import multer from "multer";
import { Op } from "sequelize";
import { ReadAccess } from "../models/read_access";
import { WriteAccess } from "../models/write_access";
import { AccessRequest, AccessRequestType } from "../models/request";
import { Topic } from "../models/topic";

dotenv.config();

const router = express.Router();
const upload = multer();
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    req.user ? next() : res.sendStatus(401);
};

const isHighestPrivilege = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.user && req.user.email == "yxchia98@gmail.com" ? next() : res.sendStatus(401);
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
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

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
            res.status(500).send({ error: true, message: "Logout error" });
        }
        // req.session?.destroy((err: any) => {});
    });
    res.redirect(process.env.CLIENT_URL);
});

/**
 * Get specific user's read accesses
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/read", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: {},
        });
        return;
    }
    const userId: string = <string>req.query.user_id;
    try {
        const queryReadAccess = await ReadAccess.findAll({
            where: {
                user_id: userId,
            },
        });
        console.log(queryReadAccess);
        res.status(200).send({
            error: false,
            message: "Successfully retrieved read access for user",
            data: queryReadAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in granting read access",
        });
    }
});

/**
 * Get specific user's write accesses
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/write", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: {},
        });
        return;
    }
    const userId: string = <string>req.query.user_id;
    try {
        const queryReadAccess = await WriteAccess.findAll({
            where: {
                user_id: userId,
            },
        });
        res.status(200).send({
            error: false,
            message: "Successfully retrieved read access for user",
            data: queryReadAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in granting read access",
        });
    }
});

/**
 * Get all access requests approvable by specific user
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/requestapproval", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: {},
        });
        return;
    }
    const userId: string = <string>req.query.user_id;
    try {
        const queryReadAccess = await AccessRequest.findAll({
            where: {
                approver_id: userId,
            },
        });
        res.status(200).send({
            error: false,
            message: "Successfully retrieved access requests for user",
            data: queryReadAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in granting read access",
        });
    }
});

/**
 * Get all access requests submitted by specific user
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/submittedrequest", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: {},
        });
        return;
    }
    const userId: string = <string>req.query.user_id;
    try {
        const queryReadAccess = await AccessRequest.findAll({
            where: {
                requestor_id: userId,
            },
        });
        res.status(200).send({
            error: false,
            message: "Successfully retrieved access requests for user",
            data: queryReadAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in granting read access",
        });
    }
});

export default router;
