import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import {
    initBucket,
    checkBucketFolder,
    createBucketFolder,
    deleteBucketItem,
} from "../services/awsbucket";
import dotenv from "dotenv";
import { sequelize } from "../services/database";
import { Topic, TopicType } from "../models/topic";
import { TopicFile, TopicFileType } from "../models/topic_file";
import { AppUser } from "../models/app_user";
import { Agency } from "../models/agency";
import topicController from "../controllers/topicController";
import { APIKey } from "../models/apikey";
dotenv.config();

interface TypeMap {
    [key: string]: string;
}

// interface that adds required parameters for a topic file upload request
interface TopicFileRequest extends Request {
    topicFolder: string;
    file_id: string;
}

const router = express.Router();

const FILE_TYPE_MAP: TypeMap = {
    "application/csv": "csv",
    "text/csv": "csv",
};

const s3 = new S3Client({
    region: process.env.AWS_S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_ACCESS_SECRET,
    },
});

const upload = multer();

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: "public-read",
        // metadata: async function (req: TopicFileRequest, file: Express.Multer.File, cb: any) {},
        key: async function (req: TopicFileRequest, file: Express.Multer.File, cb: any) {
            // const topicFolder = "topics/" + req.body.topic + "/";
            let uploadError = new Error("topic not found or invalid file type");
            try {
                const isValid = FILE_TYPE_MAP[file.mimetype];
                const queryTopic = await Topic.findByPk(req.body.topic_id);
                if (queryTopic && isValid) {
                    uploadError = null;
                    // set found topic uri into req object
                    req.topicFolder = queryTopic.dataValues.topic_url;
                    await initBucket(s3);
                    // insert incoming topic file record into database

                    // check if topic folder exists in s3
                    const topicExist = await checkBucketFolder(
                        s3,
                        process.env.AWS_S3_BUCKET_NAME,
                        req.topicFolder
                    );
                    // if topic exists, insert record into DB before uploading
                    if (topicExist.success) {
                        const record: TopicFileType = {
                            topic_id: queryTopic.topic_id,
                            agency_id: queryTopic.agency_id,
                            file_url: "pending",
                        };
                        const insertedRecord = await TopicFile.create(record);
                        req.file_id = insertedRecord.dataValues.file_id;
                        cb(null, req.topicFolder + Date.now().toString() + "-" + file.originalname);
                    } else {
                        cb(uploadError.message, { fieldname: null });
                    }
                } else {
                    cb(uploadError.message, { fieldname: null });
                }
            } catch (error) {
                cb(uploadError.message, { fieldname: null });
            }
        },
    }),
});

const uploadS3WithKey = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: "public-read",
        // metadata: async function (req: TopicFileRequest, file: Express.Multer.File, cb: any) {},
        key: async function (req: TopicFileRequest, file: Express.Multer.File, cb: any) {
            // const topicFolder = "topics/" + req.body.topic + "/";
            let uploadError = new Error("topic not found or invalid file type");
            try {
                const request_key = <string>req.query.key_id;
                const isValid = FILE_TYPE_MAP[file.mimetype];
                const queryAPIKey = await APIKey.findByPk(request_key);
                const queryUser = await AppUser.findByPk(queryAPIKey.user_id);
                const queryTopic = await Topic.findByPk(queryAPIKey.topic_id);
                if (queryAPIKey && queryUser && queryTopic && isValid) {
                    uploadError = null;
                    // set found topic uri into req object
                    req.topicFolder = queryTopic.dataValues.topic_url;
                    await initBucket(s3);
                    // insert incoming topic file record into database

                    // check if topic folder exists in s3
                    const topicExist = await checkBucketFolder(
                        s3,
                        process.env.AWS_S3_BUCKET_NAME,
                        req.topicFolder
                    );
                    // if topic exists, insert record into DB before uploading
                    if (topicExist.success) {
                        const record: TopicFileType = {
                            topic_id: queryTopic.topic_id,
                            agency_id: queryTopic.agency_id,
                            file_url: "pending",
                        };
                        const insertedRecord = await TopicFile.create(record);
                        req.file_id = insertedRecord.dataValues.file_id;
                        cb(null, req.topicFolder + Date.now().toString() + "-" + file.originalname);
                    } else {
                        cb(uploadError.message, { fieldname: null });
                    }
                } else {
                    cb(uploadError.message, { fieldname: null });
                }
            } catch (error) {
                cb(uploadError.message, { fieldname: null });
            }
        },
    }),
});

/*-------------------- TOPIC API START ---------------*/

/**
 * Create new topic endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      topic_name - The name of the topic
 *      user_id - The owner of the topic (user creating the topic)
 *      agency_id - The agency which the topic belongs to
 *      topic_description - The long description for the topic
 *
 * Returns: boolean error, string message
 */
router.post("/create", upload.none(), topicController.createTopic);

/**
 * Update Topic details endpoint
 * Type: PUT
 * InputType: form-body
 *
 * Input:
 *      topic_id - The id of the topic
 *      user_id - The user identifier for the owner of the topic (optional)
 *      agency_id - The agency identifier for the associated agency (optional)
 *      topic_name - The name of the topic (optional)
 *      description - Brief description of the topic (optional)
 *
 * Returns: boolean error, string message
 */
router.put("/update", upload.none(), topicController.updateTopic);

/**
 * Delete topic endpoint
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      topic_id - The id of the topic
 *
 * Returns: boolean error, string message
 */
router.delete("/delete", upload.none(), topicController.deleteTopic);

/**
 * Publish Topic File endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      user_id - The user ID of the current user uploading the file
 *      topic_id - The identifier of the Topic
 *      uploaded_file - .csv file to be uploaded into that topic
 *
 * Returns: boolean error, string message
 */
router.post("/publish", uploadS3.single("uploaded_file"), topicController.publishTopicFile);

/**
 * Publish Topic File with API Key endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      key_id - the identifier for the API Key to publish files into
 *      uploaded_file - .csv file to be uploaded into that topic
 *
 * Returns: boolean error, string message
 */
router.post(
    "/keypublish",
    uploadS3WithKey.single("uploaded_file"),
    topicController.publishTopicFileWithKey
);

/**
 * Delete topic file endpoint
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      file_id - The identifier of the topic file
 *
 * Returns: boolean error, string message
 */
router.delete("/deletefile", upload.none(), topicController.deleteTopicFile);

export default router;
