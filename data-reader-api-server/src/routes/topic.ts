import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { Topic } from "../models/topic";
import { TopicFile } from "../models/topic_file";
dotenv.config();

const router = express.Router();

const upload = multer();

/*-------------------- TOPIC API START ---------------*/

/**
 * Get information of all Topics endpoint
 * Type: GET
 * InputType: Params
 * Input: -
 * Returns: boolean error, string message, obj data
 */
router.get("/topics", upload.none(), async (req: Request, res: Response) => {
    try {
        const queryTopics = await Topic.findAll();
        if (queryTopics) {
            res.status(200).send({
                error: false,
                message: "Successfully retrieved topics",
                data: queryTopics,
            });
        } else {
            res.status(200).send({
                error: true,
                message: "No existing topics",
                data: {},
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving topics",
            data: {},
        });
    }
});

/**
 * Get information of specific Topic endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      topic_id - The identifier for the specified topic
 * Returns: boolean error, string message, obj data
 */
router.get("/topic", upload.none(), async (req: Request, res: Response) => {
    console.log(req.query.topic_id);
    if (!req.query.topic_id) {
        res.status(404).send({
            error: true,
            message: "Mandatory fields not set",
            data: {},
        });
        return;
    }
    try {
        const queryTopics = await Topic.findByPk(<string>req.query.topic_id);
        if (queryTopics) {
            res.status(200).send({
                error: false,
                message: "Successfully retrieved topics",
                data: queryTopics.dataValues,
            });
        } else {
            res.status(200).send({
                error: true,
                message: "No existing topics",
                data: {},
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving topics",
            data: {},
        });
    }
});

/**
 * Get all Topic Files associated with given Topic endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      topic_id - The identifier for the specified topic
 * Returns: boolean error, string message, obj data
 */
router.get("/topicfiles", upload.none(), async (req: Request, res: Response) => {
    console.log(req.query.topic_id);
    if (!req.query.topic_id) {
        res.status(404).send({
            error: true,
            message: "Mandatory fields not set",
            data: {},
        });
        return;
    }
    try {
        // check if topic exists
        const topicId = <string>req.query.topic_id;
        const queryTopics = await Topic.findByPk(topicId);
        if (queryTopics) {
            // if topic exists, query for all topic files associated
            const queryTopicFiles = await TopicFile.findAll({
                where: {
                    topic_id: topicId,
                },
            });
            if (queryTopicFiles) {
                res.status(200).send({
                    error: false,
                    message: "Successfully retrieved files in topic",
                    data: queryTopicFiles,
                });
            } else {
                res.status(404).send({
                    error: true,
                    message: "No topic file found in topic",
                    data: {},
                });
            }
        } else {
            res.status(404).send({
                error: true,
                message: "No existing topics",
                data: {},
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving topics",
            data: {},
        });
    }
});

/**
 * Get specific Topic File information endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      file_id - The identifier for the specified file
 * Returns: boolean error, string message, obj data
 */
router.get("/singlefile", upload.none(), async (req: Request, res: Response) => {
    console.log(req.query.file_id);
    if (!req.query.file_id) {
        res.status(404).send({
            error: true,
            message: "Mandatory fields not set",
            data: {},
        });
        return;
    }
    try {
        const fileId = <string>req.query.file_id;
        const queryTopicFile = await TopicFile.findByPk(fileId);
        if (queryTopicFile) {
            res.status(200).send({
                error: false,
                message: "Successfully retrieved Topic File",
                data: queryTopicFile.dataValues,
            });
        } else {
            res.status(404).send({
                error: true,
                message: "No Topic File found",
                data: {},
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving topics",
            data: {},
        });
    }
});

/**
 * Get all existing Topic Files endpoint
 * Type: GET
 * InputType: Params
 * Input: -
 * Returns: boolean error, string message, obj data
 */
router.get("/allfiles", upload.none(), async (req: Request, res: Response) => {
    try {
        const queryTopicFiles = await TopicFile.findAll();
        if (queryTopicFiles) {
            res.status(200).send({
                error: false,
                message: "Successfully retrieved Topic File",
                data: queryTopicFiles,
            });
        } else {
            res.status(404).send({
                error: true,
                message: "No Topic File found",
                data: {},
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving topics",
            data: {},
        });
    }
});

export default router;
