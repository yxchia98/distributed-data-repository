import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import {
    initBucket,
    checkBucketFolder,
    createBucketFolder,
    deleteBucketFolder,
} from "../services/awsbucket";
import dotenv from "dotenv";
import { sequelize } from "../services/database";
import { Topic } from "../models/topic";
import { TopicFile, TopicFileType } from "../models/topic_file";
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
        metadata: async function (req: TopicFileRequest, file: Express.Multer.File, cb: any) {
            try {
                // check and insert into database
                // const queryTopic = await Topic.findByPk(req.body.topic_id);
                let uploadError = new Error("topic not found");
                // insert into database
                // upload file into s3
                await initBucket(s3);
                // const topicFolder = "topics/" + req.body.topic + "/";
                const topicExist = await checkBucketFolder(
                    s3,
                    process.env.AWS_S3_BUCKET_NAME,
                    req.topicFolder
                );

                if (topicExist.success) {
                    // upload file into that folder
                    uploadError.message = "invalid file type";
                    const isValid = FILE_TYPE_MAP[file.mimetype];
                    if (isValid) {
                        uploadError = null;
                    }
                    cb(uploadError, { fieldname: file.fieldname });
                } else {
                    cb(uploadError.message, { fieldname: null });
                }
            } catch (error: any) {
                cb(error.message, { fieldname: null });
            }
        },
        key: async function (req: TopicFileRequest, file: Express.Multer.File, cb: any) {
            // const topicFolder = "topics/" + req.body.topic + "/";
            try {
                const queryTopic = await Topic.findByPk(req.body.topic_id);
                if (queryTopic) {
                    // set found topic uri into req object
                    req.topicFolder = queryTopic.dataValues.topic_url;

                    // insert incoming topic file record into database
                    const record: TopicFileType = {
                        topic_id: queryTopic.topic_id,
                        agency_id: queryTopic.agency_id,
                        file_url: "pending",
                    };
                    const insertedRecord = await TopicFile.create(record);
                    req.file_id = insertedRecord.dataValues.file_id;
                    cb(null, req.topicFolder + Date.now().toString() + "-" + file.originalname);
                } else {
                    cb("error", { fieldname: null });
                }
            } catch (error) {
                cb("error", { fieldname: null });
            }
        },
    }),
});

/*-------------------- TOPIC API START ---------------*/

router.post(
    "/publish",
    uploadS3.single("uploaded_file"),
    async (req: TopicFileRequest, res: Response) => {
        let fileName: string = "";
        const file: any = req.file;
        if (file) {
            // get file URI
            fileName = file.location;
            try {
                const queryTopicFile = await TopicFile.findByPk(req.file_id);
                queryTopicFile.update({
                    file_url: fileName,
                });
            } catch (error) {}
            res.status(200).send({
                error: false,
                message: `Successfully uploaded file. URI: ${fileName}`,
            });
        } else {
            res.status(500).send({
                error: true,
                message: `error uploading file to ${req.body.topic} topic`,
            });
        }
    }
);

router.get("/check", async (req: Request, res: Response) => {
    if (!req.query.topicname) {
        res.send({
            error: true,
            message: "folder not found",
        });
        return;
    }

    const folder = "topics/" + req.query.topicname + "/";
    console.log(folder);
    const result = await checkBucketFolder(s3, process.env.AWS_S3_BUCKET_NAME, folder);
    if (result.success) {
        res.status(200).send({
            error: false,
            message: "folder found!",
        });
    } else {
        res.send({
            error: true,
            message: "folder not found",
        });
    }
    return;
});

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
 * Returns: boolean error, string message, obj data
 */
router.post("/create", upload.none(), async (req: Request, res: Response) => {
    // check for compulsory fields
    if (!(req.body.topic_name || req.body.user_id || req.body.agency_id)) {
        res.send({
            error: true,
            message: "no topic specified",
        });
    }
    const folder = `topics/${req.body.topic_name}/`;
    try {
        console.log(folder);
        // check if topic folder already exists in S3
        const topicExistResponse = await checkBucketFolder(
            s3,
            process.env.AWS_S3_BUCKET_NAME,
            folder
        );
        // check if record already exists
        const queryTopic = await Topic.findAll({
            where: {
                topic_name: req.body.topic_name,
            },
        });
        if (!queryTopic.length && !topicExistResponse.success) {
            // create folder in S3
            const result = await createBucketFolder(s3, process.env.AWS_S3_BUCKET_NAME, folder);
            if (result.success) {
                // create topic record after creating s3 topic folder
                // const topicURI = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${folder}`;
                const topicURI = `${folder}`;
                const topicDesc = req.body.topic_description ? req.body.topic_description : "";
                const insertTopic = await Topic.create({
                    user_id: req.body.user_id,
                    agency_id: req.body.agency_id,
                    topic_name: req.body.topic_name,
                    topic_url: topicURI,
                    description: topicDesc,
                });
                if (insertTopic) {
                    res.status(200).send({
                        error: false,
                        message: "Topic created!",
                    });
                } else {
                    // if cant insert into db, delete the previously created s3 topic folder
                    await deleteBucketFolder(s3, process.env.AWS_S3_BUCKET_NAME, folder);
                    res.send({
                        error: true,
                        message: "Error creating topic",
                    });
                }
            } else {
                res.send({
                    error: true,
                    message: "Error creating topic",
                });
            }
        } else {
            res.status(404).send({
                error: false,
                message: "Error, topic already exists",
            });
        }
    } catch (error: any) {
        // delete record and created s3 topic folders, if error
        console.log(error);
        try {
            await deleteBucketFolder(s3, process.env.AWS_S3_BUCKET_NAME, folder);
            await Topic.destroy({
                where: {
                    user_id: req.body.user_id,
                    agency_id: req.body.agency_id,
                    topic_name: req.body.topic_name,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                error: true,
                message: "Error creating topic",
            });
            return;
        }
        res.status(500).send({
            error: true,
            message: "Error creating topic",
        });
    }
});

/**
 * Delete topic endpoint
 * @param {Object} req.body - The form object parsed into the API
 * @param {string} req.body.topic_id - The id of the topic
 */
router.delete("/delete", upload.none(), async (req: Request, res: Response) => {
    console.log("deleting topic!");
    console.log(`query: ${JSON.stringify(req.query)}`);
    console.log(`body: ${JSON.stringify(req.body)}`);
    if (!req.body.topic_id) {
        res.send({
            error: true,
            message: "no topic specified",
        });
    }
    try {
        // check if record exists in db
        const queryTopic = await Topic.findByPk(req.body.topic_id);
        let folder = "";
        if (queryTopic) {
            folder = queryTopic.topic_url;
            console.log(folder);

            // check if topic folder already exists in S3
            const topicExistResponse = await checkBucketFolder(
                s3,
                process.env.AWS_S3_BUCKET_NAME,
                folder
            );
            if (topicExistResponse.success) {
                // delete folder in S3
                const result = await deleteBucketFolder(s3, process.env.AWS_S3_BUCKET_NAME, folder);
                if (result.success) {
                    res.status(200).send({
                        error: false,
                        message: "Successfully deleted topic!",
                    });
                    // delete the record in db
                    await queryTopic.destroy();
                } else {
                    res.send({
                        error: true,
                        message: "Error deleting topic",
                    });
                }
            } else {
                // delete record in db
                await queryTopic.destroy();
                res.status(500).send({
                    error: true,
                    message: "Successfully deleted topic",
                });
            }
        } else {
            res.status(400).send({
                error: true,
                message: "Error, topic not found",
            });
        }
    } catch (error: any) {
        res.status(500).send({
            error: true,
            message: "Error deleting topic",
        });
    }
});

export default router;
