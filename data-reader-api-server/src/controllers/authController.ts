import { NextFunction, Request, Response } from "express";
import "../services/passport";
import { ReadAccess } from "../models/read_access";
import { WriteAccess } from "../models/write_access";
import { AccessRequest } from "../models/request";

interface OAuthUserRequest extends Request {
    user: OAuthUser;
}

interface OAuthUser {
    id: string;
    email: string;
}

/**
 * Endpoint to check if current session is logged in
 */
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    req.user ? next() : res.sendStatus(401);
};

// const isHighestPrivilege = (req: Request, res: Response, next: NextFunction) => {
//     // @ts-ignore
//     req.user && req.user.email == "yxchia98@gmail.com" ? next() : res.sendStatus(401);
// };

/**
 * Endpoint for OAuth2.0 login (Google/Azure)
 */
const checkLoginSuccess = (req: Request, res: Response) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            // @ts-ignore
            userId: req.user.id,
            // @ts-ignore
            email: req.user.email,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
};

/**
 * OAuth2 failure callback
 */
const authFailure = (req: Request, res: Response) => {
    res.status(401).send({
        error: true,
        message: "Log in failure",
    });
};

/**
 * test page for protected authentication
 */
// const protectedAuth = (req: Request, res: Response) => {
//     console.log(req.user);
//     if (req.user) {
//         const currUser: Express.User = req.user;
//         res.status(200).send({
//             error: false,
//             message: "Success",
//             data: currUser,
//         });
//     }
// };

/**
 * test page for highest privilege authentication
 */
const topSecretAuth = (req: Request, res: Response) => {
    console.log(req.user);
    if (req.user) {
        const currUser: Express.User = req.user;
        res.status(200).send({
            error: false,
            message: "Success",
            data: currUser,
        });
    }
};

/**
 * Get all user's read accesses for a certain topic
 * Type: GET
 * InputType: Params
 * Input: topic_id
 * Returns: boolean error, string message, obj data
 */
const getTopicReadAccess = async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.topic_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: [],
        });
        return;
    }
    const topicId: string = <string>req.query.topic_id;

    try {
        const queryReadAccess = await ReadAccess.findAll({
            where: {
                topic_id: topicId,
            },
        });
        console.log(queryReadAccess);
        res.status(200).send({
            error: false,
            message: "Successfully retrieved read access for topic",
            data: queryReadAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in retrieving read access for topic",
            data: [],
        });
    }
};

/**
 * Get specific user's read accesses
 * Type: GET
 * InputType: Params
 * Input: topic_id
 * Returns: boolean error, string message, obj data
 */
const getUserReadAccess = async (req: OAuthUserRequest, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: {},
        });
        return;
    }
    // if (!req.user) {
    //     res.status(403).send({
    //         error: true,
    //         message: "Error, no user logged in",
    //         data: [],
    //     });
    //     return;
    // }
    // const userId: string = <string>req.user.id;
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
            message: "Error in retrieving read access",
            data: [],
        });
    }
};

/**
 * Get specific user's write accesses
 * Type: GET
 * InputType: Params
 * Input: topic_id
 * Returns: boolean error, string message, obj data
 */
const getTopicWriteAccess = async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.topic_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: [],
        });
        return;
    }

    const topicId: string = <string>req.query.topic_id;

    try {
        const queryReadAccess = await WriteAccess.findAll({
            where: {
                topic_id: topicId,
            },
        });
        res.status(200).send({
            error: false,
            message: "Successfully retrieved write access for topic",
            data: queryReadAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error retrieving write access for topic",
            data: [],
        });
    }
};

/**
 * Get specific user's write accesses
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
const getUserWriteAccess = async (req: OAuthUserRequest, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: [],
        });
        return;
    }
    // if (!req.user) {
    //     res.status(403).send({
    //         error: true,
    //         message: "Error, no user logged in",
    //         data: [],
    //     });
    //     return;
    // }
    // const userId: string = <string>req.user.id;
    const userId: string = <string>req.query.user_id;
    try {
        const queryReadAccess = await WriteAccess.findAll({
            where: {
                user_id: userId,
            },
        });
        res.status(200).send({
            error: false,
            message: "Successfully retrieved write access for user",
            data: queryReadAccess,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error in retrieving write access",
            data: [],
        });
    }
};

/**
 * Get all access requests approvable by specific user
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
const getUserApprovableAccessRequest = async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: [],
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
            data: [],
        });
    }
};

/**
 * Get all access requests submitted by specific user
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
const getUserSubmittedAccessRequest = async (req: Request, res: Response) => {
    // check for required fields
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, mandatory fields not set",
            data: [],
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
            data: [],
        });
    }
};

export default module.exports = {
    isLoggedIn,
    checkLoginSuccess,
    authFailure,
    topSecretAuth,
    getUserReadAccess,
    getUserWriteAccess,
    getTopicReadAccess,
    getTopicWriteAccess,
    getUserApprovableAccessRequest,
    getUserSubmittedAccessRequest,
};
