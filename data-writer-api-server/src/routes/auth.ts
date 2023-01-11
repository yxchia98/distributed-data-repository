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
 * Add new read access endpoint
 */
router.post("/read", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    if (!(req.body.user_id && req.body.topic_id)) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
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
            // insert access record
            await ReadAccess.create({
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            });
            res.status(200).send({
                error: false,
                message: "successfully granted write access",
            });
        } else {
            res.status(200).send({
                error: true,
                message: `Error, ${req.body.user_id} already has the requested access`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in granting read access",
        });
    }
});

/**
 * Delete read access endpoint
 */
router.delete("/read", upload.none(), async (req: Request, res: Response) => {
    // Check for required fields
    if (!(req.body.user_id && req.body.topic_id)) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
        });
        return;
    }
    // Search for access record, use findOne for composite key
    try {
        const queryRead = await ReadAccess.findOne({
            where: {
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            },
        });
        // delete if record match, else show error
        if (queryRead) {
            await queryRead.destroy();
            res.status(200).send({
                error: false,
                message: "Successfully deleted access",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Read access does not exist",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error deleting read access",
        });
    }
});

/**
 * Add new write access endpoint
 */
router.post("/write", upload.none(), async (req: Request, res: Response) => {
    // check for required fields
    if (!(req.body.user_id && req.body.topic_id)) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
        });
        return;
    }
    try {
        // check if access already exists
        // cannot use findByPk for composite keys, must use findOne instead
        const queryRead = await WriteAccess.findOne({
            where: {
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            },
        });
        if (!queryRead) {
            // insert access record
            await WriteAccess.create({
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            });
            res.status(200).send({
                error: false,
                message: "successfully granted write access",
            });
        } else {
            res.status(200).send({
                error: true,
                message: `Error, ${req.body.user_id} already has the requested access`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in granting write access",
        });
    }
});

/**
 * Delete write access endpoint
 */
router.delete("/write", upload.none(), async (req: Request, res: Response) => {
    // Check for required fields
    if (!(req.body.user_id && req.body.topic_id)) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
        });
        return;
    }
    // Search for access record, use findOne for composite key
    try {
        const queryRead = await WriteAccess.findOne({
            where: {
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            },
        });
        // delete if record match, else show error
        if (queryRead) {
            await queryRead.destroy();
            res.status(200).send({
                error: false,
                message: "Successfully deleted  write access",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Write access does not exist",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error deleting read access",
        });
    }
});

/**
 * Add new access request endpoint
 * Requests will be added as pending under the Request table
 */
router.post("/accessrequest", upload.none(), async (req: Request, res: Response) => {
    // Takes in the user and the topic requested to
    // Checks if required fields are present
    if (!(req.body.requestor_id && req.body.topic_id && req.body.access_type)) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
        });
        return;
    }
    const description = req.body.description ? req.body.description : "";
    try {
        // check for existing request
        const queryAccessRequest = await AccessRequest.findOne({
            where: {
                requestor_id: req.body.requestor_id,
                topic_id: req.body.topic_id,
                access_type: req.body.access_type,
                [Op.or]: [
                    {
                        status: "Pending",
                    },
                    { status: "Approved" },
                ],
            },
        });
        if (queryAccessRequest) {
            res.status(200).send({
                error: true,
                message: "Error, request already exists or user already has access",
            });
            return;
        }

        // query for topic and get details of topic owner
        const queryTopic = await Topic.findByPk(req.body.topic_id);
        if (queryTopic) {
            // get id of topic owner and put in request record
            const record: AccessRequestType = {
                requestor_id: req.body.requestor_id,
                approver_id: queryTopic.user_id,
                topic_id: queryTopic.topic_id,
                access_type: req.body.access_type,
                description: description,
            };
            await AccessRequest.create(record);
            res.status(200).send({
                error: false,
                message: "Successfully created access request",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error, topic not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error submitting new access request",
        });
    }
});

/**
 * Update status of specific access request
 */
router.put("/accessrequest", upload.none(), async (req: Request, res: Response) => {
    // Check if required fields are present
    if (!req.body.request_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
        });
        return;
    }
    // Check for existing record
    try {
        const queryAccessRequest = await AccessRequest.findByPk(req.body.request_id);
        if (queryAccessRequest) {
            // update access request
            const accessRequestDetails: AccessRequestType = {
                requestor_id: queryAccessRequest.requestor_id,
                approver_id: queryAccessRequest.approver_id,
                topic_id: queryAccessRequest.topic_id,
                access_type: req.body.access_type
                    ? req.body.access_type
                    : queryAccessRequest.access_type,
                status: req.body.status ? req.body.status : queryAccessRequest.status,
                description: req.body.description
                    ? req.body.description
                    : queryAccessRequest.description,
            };
            await queryAccessRequest.update(accessRequestDetails);
            res.status(200).send({
                error: false,
                message: "Successfully updated access request",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error, access request not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error deleting access request",
        });
    }
});

/**
 * Delete pending access request endpoint
 */
router.delete("/accessrequest", upload.none(), async (req: Request, res: Response) => {
    // Check if required fields are present
    if (!req.body.request_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
        });
        return;
    }
    // Check for existing record
    try {
        const queryAccessRequest = await AccessRequest.findByPk(req.body.request_id);
        if (queryAccessRequest) {
            await queryAccessRequest.destroy();
            res.status(200).send({
                error: false,
                message: "Successfully deleted access request",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error, access request not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error deleting access request",
        });
    }
});

export default router;
