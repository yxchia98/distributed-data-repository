import { Request, Response } from "express";
import { Delete, ObjectIdentifier, S3Client } from "@aws-sdk/client-s3";
import {
    checkBucketFolder,
    createBucketFolder,
    deleteBucketItem,
    deleteFilesInBucket,
} from "../services/awsbucket";
import dotenv from "dotenv";
import { Topic, TopicType } from "../models/topic";
import { TopicFile } from "../models/topic_file";
import { AppUser } from "../models/app_user";
import { Agency } from "../models/agency";
import { WriteAccess } from "../models/write_access";
import { ReadAccess } from "../models/read_access";
import { AccessRequest } from "../models/request";
import { DataTypes } from "sequelize";
import dayjs from "dayjs";
import { APIKey } from "../models/apikey";

interface TypeMap {
    [key: string]: string;
}

const FILE_TYPE_MAP: TypeMap = {
    "application/csv": "csv",
    "text/csv": "csv",
};

// interface that adds required parameters for a topic file upload request
interface TopicFileRequest extends Request {
    topicFolder: string;
    file_id: string;
}

// AWS S3 client instance
const s3 = new S3Client({
    region: process.env.AWS_S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_ACCESS_SECRET,
    },
});

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
const publishTopicFile = async (req: TopicFileRequest, res: Response) => {
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
            const queryTopic = await Topic.findByPk(queryTopicFile.topic_id);
            queryTopic.update({
                last_update: dayjs(),
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
};

/**
 * Publish Topic File with API Key endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      key_id - the identifier for the API Key to publish files into
 *      uploaded_file - .csv file to be uploaded into that topic
 * Returns: boolean error, string message
 */
const publishTopicFileWithKey = async (req: TopicFileRequest, res: Response) => {
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
            const queryTopic = await Topic.findByPk(queryTopicFile.topic_id);
            queryTopic.update({
                last_update: dayjs(),
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
};

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
 * Returns: boolean error, string message, string topic_id
 */
const createTopic = async (req: Request, res: Response) => {
    console.log(req.body);
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
                        topic_id: insertTopic.topic_id,
                    });
                } else {
                    // if cant insert into db, delete the previously created s3 topic folder
                    await deleteBucketItem(s3, process.env.AWS_S3_BUCKET_NAME, folder);
                    res.send({
                        error: true,
                        message: "Error creating topic",
                        topic_id: "",
                    });
                }
            } else {
                res.send({
                    error: true,
                    message: "Error creating topic",
                    topic_id: "",
                });
            }
        } else {
            res.status(400).send({
                error: false,
                message: "Error, topic already exists",
                topic_id: "",
            });
        }
    } catch (error: any) {
        // delete record and created s3 topic folders, if error
        console.log(error);
        try {
            await deleteBucketItem(s3, process.env.AWS_S3_BUCKET_NAME, folder);
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
};

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
const updateTopic = async (req: Request, res: Response) => {
    // check if mandatory fields are sent
    if (!req.body.topic_id) {
        res.status(404).send({
            error: true,
            message: "Mandatory fields not set",
        });
        return;
    }
    try {
        // search db for the given topic_id record
        const topicId = <string>req.body.topic_id;
        const queryTopic = await Topic.findByPk(topicId);
        if (queryTopic.dataValues) {
            // set updated values in object
            const topicItem: TopicType = {
                user_id: req.body.user_id ? req.body.user_id : queryTopic.dataValues.user_id,
                agency_id: req.body.agency_id
                    ? req.body.agency_id
                    : queryTopic.dataValues.agency_id,
                topic_name: req.body.topic_name
                    ? req.body.topic_name
                    : queryTopic.dataValues.topic_name,
                description: req.body.description
                    ? req.body.description
                    : queryTopic.dataValues.description,
            };
            const queryUser = await AppUser.findByPk(topicItem.user_id);
            const queryAgency = await Agency.findByPk(topicItem.agency_id);
            // check if user_id corresponds to a User
            if (!queryUser.dataValues) {
                res.status(404).send({
                    error: true,
                    message: "Error, specified User does not exist",
                });
                return;
            }
            // check if agency_id corresponds to a Agency
            if (!queryAgency.dataValues) {
                res.status(404).send({
                    error: true,
                    message: "Error, specified User does not exist",
                });
                return;
            }
            await queryTopic.update(topicItem);
            res.status(200).send({
                error: false,
                message: "Successfully updated topic",
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
            message: "Error updating topic",
        });
    }
};

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
const deleteTopic = async (req: Request, res: Response) => {
    if (!req.body.topic_id) {
        res.send({
            error: true,
            message: "no topic specified",
        });
    }
    try {
        // check if record exists in db
        const queryTopicResponse = await Topic.findByPk(req.body.topic_id);
        let folder = "";
        if (queryTopicResponse) {
            // check if topic folder already exists in S3
            folder = queryTopicResponse.topic_url;
            const topicExistResponse = await checkBucketFolder(
                s3,
                process.env.AWS_S3_BUCKET_NAME,
                folder
            );
            if (topicExistResponse.success) {
                // get key of all items in folder
                const queryTopicFilesResponse = await TopicFile.findAll({
                    where: {
                        topic_id: queryTopicResponse.topic_id,
                    },
                });
                let fileUrls = {
                    Objects: <Array<ObjectIdentifier>>[],
                };
                // ensure that there are no spaces in the filename, or it will deform the deletion
                queryTopicFilesResponse.forEach((topicFile) => {
                    let fileURI = topicFile.file_url.split("/").slice(-3).join("/");
                    let currFile: ObjectIdentifier = {
                        Key: fileURI,
                    };
                    fileUrls.Objects.push(currFile);
                });

                const deleteBucketItems: Delete = fileUrls;
                const deleteBucketItemsResult = await deleteFilesInBucket(
                    s3,
                    process.env.AWS_S3_BUCKET_NAME,
                    deleteBucketItems
                );
                // delete folder in S3
                const deleteBucketResult = await deleteBucketItem(
                    s3,
                    process.env.AWS_S3_BUCKET_NAME,
                    folder
                );
                if (deleteBucketResult.success) {
                    // delete all dependencies of the topic before deleting the actual topic record in db
                    await TopicFile.destroy({
                        where: {
                            topic_id: queryTopicResponse.topic_id,
                        },
                    });
                    await APIKey.destroy({
                        where: {
                            topic_id: queryTopicResponse.topic_id,
                        },
                    });
                    await AccessRequest.destroy({
                        where: {
                            topic_id: queryTopicResponse.topic_id,
                        },
                    });
                    await WriteAccess.destroy({
                        where: {
                            topic_id: queryTopicResponse.topic_id,
                        },
                    });
                    await ReadAccess.destroy({
                        where: {
                            topic_id: queryTopicResponse.topic_id,
                        },
                    });
                    await queryTopicResponse.destroy();
                    res.status(200).send({
                        error: false,
                        message: "Successfully deleted topic!",
                    });
                } else {
                    res.send({
                        error: true,
                        message: "Error deleting topic",
                    });
                }
            } else {
                // delete record in db
                // delete all dependencies of the topic before deleting the actual topic record in db
                await TopicFile.destroy({
                    where: {
                        topic_id: queryTopicResponse.topic_id,
                    },
                });
                await APIKey.destroy({
                    where: {
                        topic_id: queryTopicResponse.topic_id,
                    },
                });
                await AccessRequest.destroy({
                    where: {
                        topic_id: queryTopicResponse.topic_id,
                    },
                });
                await WriteAccess.destroy({
                    where: {
                        topic_id: queryTopicResponse.topic_id,
                    },
                });
                await ReadAccess.destroy({
                    where: {
                        topic_id: queryTopicResponse.topic_id,
                    },
                });
                await queryTopicResponse.destroy();
                res.status(500).send({
                    error: false,
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
};

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
const deleteTopicFile = async (req: Request, res: Response) => {
    // check for mandatory fields
    if (!req.body.file_id) {
        res.status(404).send({
            error: true,
            message: "Missing mandatory fields",
        });
        return;
    }
    try {
        const queryTopicFile = await TopicFile.findByPk(req.body.file_id);
        if (queryTopicFile) {
            // get relative path of specified file from s3
            const fileURI = queryTopicFile.dataValues.file_url.split("/").slice(3).join("/");
            console.log(fileURI);
            const deleteFile = await deleteBucketItem(s3, process.env.AWS_S3_BUCKET_NAME, fileURI);
            // delete record from database if s3 deletion successful
            if (deleteFile.success) {
                await queryTopicFile.destroy();
                res.status(200).send({
                    error: false,
                    message: "Successfully deleted file",
                });
            } else {
                res.status(500).send({
                    error: false,
                    message: "Error deleting file",
                });
            }
        } else {
            res.status(404).send({
                error: true,
                message: "Error, file not found",
            });
        }
    } catch (error) {
        res.send({
            error: true,
            message: "Error deleting file",
        });
    }
};

export default module.exports = {
    publishTopicFile,
    publishTopicFileWithKey,
    createTopic,
    updateTopic,
    deleteTopic,
    deleteTopicFile,
};
