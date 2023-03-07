import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { Topic } from "../models/topic";
import { TopicFile } from "../models/topic_file";
import { downloadSingleFileS3 } from "../services/awsbucket";
dotenv.config();
import fs from "fs";
import { GetObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Op } from "sequelize";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * Get information of all Topics endpoint
 * Type: GET
 * InputType: Params
 * Input: -
 * Returns: boolean error, string message, obj data
 */

// AWS S3 client instance
const s3 = new S3Client({
    region: process.env.AWS_S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_ACCESS_SECRET,
    },
});

const getAllTopics = async (req: Request, res: Response) => {
    try {
        const queryTopics = await Topic.findAll();
        if (queryTopics) {
            res.status(200).send({
                error: false,
                message: "Successfully retrieved all topics",
                data: queryTopics,
            });
        } else {
            res.status(200).send({
                error: true,
                message: "No existing topics",
                data: [],
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving topics",
            data: [],
        });
    }
};

/**
 * Get information of specific Topic endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      topic_id - The identifier for the specified topic
 * Returns: boolean error, string message, obj data
 */
const getSingleTopic = async (req: Request, res: Response) => {
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
};

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
const getAssociatedTopicFiles = async (req: Request, res: Response) => {
    if (!(req.query.topic_id && req.query.start_date && req.query.end_date)) {
        res.status(404).send({
            error: true,
            message: "Mandatory fields not set",
            data: [],
        });
        return;
    }
    try {
        // check if topic exists
        const topicId = <string>req.query.topic_id;
        const startDate = dayjs(<string>req.query.start_date, "YYYY-MM-DD").toDate();
        const endDate = dayjs(<string>req.query.end_date, "YYYY-MM-DD").toDate();
        // const startDate = dayjs.utc(<string>req.query.start_date, "YYYY-MM-DD").toDate();
        // const endDate = dayjs.utc(<string>req.query.end_date, "YYYY-MM-DD").toDate();
        const queryTopics = await Topic.findByPk(topicId);
        if (queryTopics) {
            // if topic exists, query for all topic files associated
            const queryTopicFiles = await TopicFile.findAll({
                where: {
                    topic_id: topicId,
                    file_date: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });
            if (queryTopicFiles) {
                res.status(200).send({
                    error: false,
                    message: `Successfully retrieved files in topic from ${startDate} to ${endDate}`,
                    data: queryTopicFiles,
                });
            } else {
                res.status(404).send({
                    error: true,
                    message: "No topic file found in topic",
                    data: [],
                });
            }
        } else {
            res.status(404).send({
                error: true,
                message: "No existing topics",
                data: [],
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving files in topic",
            data: [],
        });
    }
};

/**
 * Get specific Topic File information endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      file_id - The identifier for the specified file
 * Returns: boolean error, string message, obj data
 */
const getSingleTopicFile = async (req: Request, res: Response) => {
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
            message: "Error retrieving topic file",
            data: {},
        });
    }
};

/**
 * Download specific topic file
 * Type: GET
 * InputType: Params
 * Input:
 *      file_id - The identifier for the specified file
 * Returns: boolean error, string message, obj data
 */
const downloadSingleTopicFile = async (req: Request, res: Response) => {
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
            const fileKey = queryTopicFile.file_url.split("/").slice(-3).join("/");
            const fileName = queryTopicFile.file_url.split("/").slice(-1)[0];
            console.log("Trying to download file", fileKey);
            const getFileResponse = await downloadSingleFileS3(s3, fileKey);
            res.status(200).send({
                error: false,
                message: "Successfully retrieved Topic File",
                data: {
                    fileName: fileName,
                    blobString: getFileResponse.data,
                },
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
            message: "Error retrieving topic file",
            data: {},
        });
    }
};

export default module.exports = {
    getAllTopics,
    getSingleTopic,
    getAssociatedTopicFiles,
    getSingleTopicFile,
    downloadSingleTopicFile,
};
