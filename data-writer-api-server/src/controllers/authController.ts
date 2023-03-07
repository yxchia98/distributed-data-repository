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
import { APIKey } from "../models/apikey";
dotenv.config();

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
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    req.user ? next() : res.sendStatus(401);
};

const checkLoginSuccess = (req: Request, res: Response) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            data: {
                // @ts-ignore
                user_id: req.user.id,
                // @ts-ignore
                email: req.user.email,
            },
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized", userId: "" });
    }
};

/**
 * OAuth2 failure callback
 * Type: GET
 */
const authFailure = (req: Request, res: Response) => {
    res.status(401).send({
        error: true,
        message: "Log in failure",
    });
};

const logoutUser = (req: Request, res: Response) => {
    req.logout((err: any) => {
        if (err) {
            res.status(500).send({ error: true, message: "Logout error" });
        }
        // req.session?.destroy((err: any) => {});
    });
    res.redirect(process.env.CLIENT_URL);
};

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
const createReadAccess = async (req: Request, res: Response) => {
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
                message: "successfully granted read access",
            });
        } else {
            res.status(200).send({
                error: false,
                message: `${req.body.user_id} already has the requested access`,
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            error: true,
            message: "Error in granting read access",
        });
    }
};

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
const deleteReadAccess = async (req: Request, res: Response) => {
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
                message: "Successfully deleted read access",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Read access does not exist",
            });
        }
    } catch (error) {
        res.send({
            error: true,
            message: "Error deleting read access",
        });
    }
};

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
const createWriteAccess = async (req: Request, res: Response) => {
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
                error: false,
                message: `${req.body.user_id} already has the requested access`,
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            error: true,
            message: "Error in granting write access",
        });
    }
};

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
const deleteWriteAccess = async (req: Request, res: Response) => {
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
                message: "Successfully deleted write access",
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
            message: "Error deleting write access",
        });
    }
};

/**
 * Add new Access Request endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      requestor_id - User identifier that is requesting the access
 *      approver_id User identifier that is granting the access
 *      topic_id - Topic identifier to be requesting access to
 *      access_type - Type of access. READ/WRITE
 *      description - Brief description for requesting access (optional)
 *
 * Returns: boolean error, string message
 */
const createRequestAccess = async (req: Request, res: Response) => {
    // Takes in the user and the topic requested to
    // Checks if required fields are present
    if (
        !(
            req.body.requestor_id &&
            req.body.topic_id &&
            req.body.access_type &&
            req.body.approver_id
        )
    ) {
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
                        status: "PENDING",
                    },
                    // { status: "APPROVED" },
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
                // approver_id: queryTopic.user_id,
                approver_id: req.body.approver_id,
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
        res.send({
            error: true,
            message: "Error submitting new access request",
        });
    }
};

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
const updateRequestAccess = async (req: Request, res: Response) => {
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
            message: "Error updating access request",
        });
    }
};

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
const deleteAccessRequest = async (req: Request, res: Response) => {
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
};

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
const createApiKey = async (req: Request, res: Response) => {
    // Check if required fields are present
    let output = {
        error: true,
        message: "Error creating API Key",
        key: "",
    };
    if (!req.body.user_id || !req.body.topic_id) {
        output.message = "Error, mandatory fields not set";
        res.status(400).send(output);
        return;
    }
    try {
        const queryExistingKey = await APIKey.findAll({
            where: {
                user_id: req.body.user_id,
                topic_id: req.body.topic_id,
            },
        });
        if (queryExistingKey.length > 0) {
            queryExistingKey.forEach(async (element) => await element.destroy());
        }
        const createAPIKey = await APIKey.create({
            user_id: req.body.user_id,
            topic_id: req.body.topic_id,
        });
        output.error = false;
        output.message = "Successfully generated API Key";
        output.key = createAPIKey.key_id;
        res.status(200).send(output);
        return;
    } catch (error) {
        res.send(output);
        return;
    }
};

/**
 * Delete API Key Request endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      key_id - Key identifier that is granting the access
 *
 * Returns: boolean error, string message
 */
const deleteApiKey = async (req: Request, res: Response) => {
    // Check if required fields are present
    let output = {
        error: true,
        message: "Error deleting API Key",
    };
    if (!req.body.key_id) {
        output.message = "Error, mandatory fields not set";
        res.status(400).send(output);
        return;
    }
    try {
        const queryExistingKey = await APIKey.findByPk(req.body.key_id);
        await queryExistingKey.destroy();
        output.message = "Successfully deleted API Key";
        res.status(200).send(output);
        return;
    } catch (error) {
        res.send(output);
        return;
    }
};

export default module.exports = {
    isLoggedIn,
    checkLoginSuccess,
    authFailure,
    logoutUser,
    createReadAccess,
    deleteReadAccess,
    createWriteAccess,
    deleteWriteAccess,
    createRequestAccess,
    updateRequestAccess,
    deleteAccessRequest,
    createApiKey,
    deleteApiKey,
};
