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

const isHighestPrivilege = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.user && req.user.email == "yxchia98@gmail.com" ? next() : res.sendStatus(401);
};

/*-------------------- AUTH API START ---------------*/

/**
 * Check if current session has a logged in User endpoint
 * Type: GET
 * InputType: Query
 *
 * Input:
 *      user - session information for the current user
 *
 * Returns: boolean error, string message, string userid
 */
router.get("/login/success", authController.checkLoginSuccess);

/**
 * PassportJS Authentication endpoint
 * Type: GET
 * InputType: Query
 */
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

/**
 * OAuth2 callback endpoint
 * Type: GET
 * InputType: Query
 */
router.get(
    "/google/callback",
    passport.authenticate("google", {
        // successRedirect: <string>process.env.CLIENT_URL,
        successRedirect: `${process.env.CLIENT_URL}`,
        failureRedirect: "/auth/failure",
    })
);

/**
 * OAuth2 failure callback
 * Type: GET
 */
router.get("/failure", authController.authFailure);

// router.get("/protected", authController.isLoggedIn, (req: Request, res: Response) => {
//     console.log(req.user);
//     if (req.user) {
//         const currUser: Express.User = req.user;
//         res.status(200).send({
//             error: false,
//             message: "Success",
//             data: currUser,
//         });
//     }
// });

// router.get("/topSecret", isHighestPrivilege, (req: Request, res: Response) => {
//     console.log(req.user);
//     if (req.user) {
//         const currUser: Express.User = req.user;
//         res.status(200).send({
//             error: false,
//             message: "Success",
//             data: currUser,
//         });
//     }
// });
/**
 * Logout endpoint
 * Type: GET
 */
router.get("/logout", authController.logoutUser);

/**
 * Add new read access endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      user_id - User identifier to be granted access
 *      topic_id - Topic identifier to be granted access to
 *
 * Returns: boolean error, string message
 */
router.post("/read", upload.none(), authController.createReadAccess);

/**
 * Delete / Revoke Read Access endpoint
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      user_id - User identifier to be revoked access
 *      topic_id - Topic identifier to be revoked access from
 *
 * Returns: boolean error, string message
 */
router.delete("/read", upload.none(), authController.deleteReadAccess);

/**
 * Add new Write Access endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      user_id - User identifier to be granted access
 *      topic_id - Topic identifier to be granted access to
 *
 * Returns: boolean error, string message
 */
router.post("/write", upload.none(), authController.createWriteAccess);

/**
 * Delete / Revoke Write Access endpoint
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      user_id - User identifier to be revoked access
 *      topic_id - Topic identifier to be revoked access from
 *
 * Returns: boolean error, string message
 */
router.delete("/write", upload.none(), authController.deleteWriteAccess);

/**
 * Add new Access Request endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      requestor_id - User identifier that is requesting the access
 *      approver_id - User identifier that is granting the access
 *      topic_id - Topic identifier to be requesting access to
 *      access_type - Type of access. READ/WRITE
 *      description - Brief description for requesting access (optional)
 *
 * Returns: boolean error, string message
 */
router.post("/accessrequest", upload.none(), authController.createRequestAccess);

/**
 * Update status of specific access request endpoint
 * Type: PUT
 * InputType: form-body
 *
 * Input:
 *      request_id - Identifier of the request to be updated
 *      access_type - Type of access. READ/WRITE (optional)
 *      status - Status of request. PENDING/APPROVED/REJECTED (optional)
 *      description - Brief description for requesting access (optional)
 *
 * Returns: boolean error, string message
 */
router.put("/accessrequest", upload.none(), authController.updateRequestAccess);

/**
 * Delete specified access request endpoint
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      request_id - Identifier of the request to be deleted
 *
 * Returns: boolean error, string message
 */
router.delete("/accessrequest", upload.none(), authController.deleteAccessRequest);

/**
 * Generate new API Key Request endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      user_id - User identifier that is generating the key
 *      topic_id - Topic identifier that the key points to
 *
 * Returns: boolean error, string message, string key
 */
router.post("/apikey", upload.none(), authController.createApiKey);

/**
 * Delete API Key Request endpoint
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      key_id - Key identifier that is granting the access
 *
 * Returns: boolean error, string message
 */
router.delete("/apikey", upload.none(), authController.deleteApiKey);

export default router;
