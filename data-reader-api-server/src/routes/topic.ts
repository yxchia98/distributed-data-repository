import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { Topic } from "../models/topic";
import { TopicFile } from "../models/topic_file";
import topicController from "../controllers/topicController";
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
router.get("/topics", upload.none(), topicController.getAllTopics);

/**
 * Get information of specific Topic endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      topic_id - The identifier for the specified topic
 * Returns: boolean error, string message, obj data
 */
router.get("/topic", upload.none(), topicController.getSingleTopic);

/**
 * Get all Topic Files associated with given Topic endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      topic_id - The identifier for the specified topic
 *      start_date - start date of time range to retrieve files
 *      end_date - end date of time range to retrieve files
 * Returns: boolean error, string message, obj data
 */
router.get("/topicfiles", upload.none(), topicController.getAssociatedTopicFiles);

/**
 * Get specific Topic File information endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      file_id - The identifier for the specified file
 * Returns: boolean error, string message, obj data
 */
router.get("/singlefile", upload.none(), topicController.getSingleTopicFile);

/**
 * Get specific Topic File information endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      file_id - The identifier for the specified file
 * Returns: boolean error, string message, obj data
 */
router.get("/downloadsinglefile", upload.none(), topicController.downloadSingleTopicFile);

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
