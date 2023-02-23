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
import authController from "../controllers/authController";

dotenv.config();

const router = express.Router();
const upload = multer();

/*-------------------- AUTH API START ---------------*/

/**
 * Endpoint to check if current session is logged in
 */
router.get("/login/success", authController.checkLoginSuccess);

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
router.get("/failure", authController.authFailure);

/**
 * test page for protected authentication
 */
router.get("/protected", authController.isLoggedIn, authController.protectedAuth);

/**
 * test page for highest privilege authentication
 */
router.get("/topSecret", authController.isHighestPrivilege, authController.topSecretAuth);
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
router.get("/read", upload.none(), authController.getUserReadAccess);

/**
 * Get specific user's read accesses
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/topicread", upload.none(), authController.getTopicReadAccess);

/**
 * Get specific user's write accesses
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/write", upload.none(), authController.getUserWriteAccess);

/**
 * Get specific user's write accesses
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/topicwrite", upload.none(), authController.getTopicWriteAccess);

/**
 * Get all access requests approvable by specific user
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/requestapproval", upload.none(), authController.getUserApprovableAccessRequest);

/**
 * Get all access requests submitted by specific user
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/submittedrequest", upload.none(), authController.getUserSubmittedAccessRequest);

// API FOR TESTING PURPOSES
router.get("/test", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    res.status(200).send({
        error: false,
        message: "Successfully retrieved access requests for user",
        data: req.user ? req.user : {},
    });
});

export default router;
