import { S3 } from "aws-sdk";
import {
    S3Client,
    HeadBucketCommand,
    HeadBucketCommandOutput,
    CreateBucketRequest,
    CreateBucketCommand,
    CreateBucketOutput,
    GetObjectCommand,
    GetObjectCommandOutput,
    GetObjectCommandInput,
    HeadBucketCommandInput,
} from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
/**
 * @name checkBucket
 * @param {S3Client} s3
 * @returns {Promise<{success:boolean; message: string; data:string;}>}
 */
export const checkBucket = async (s3: S3Client, bucket: string) => {
    try {
        // const res = await s3.headBucket({ Bucket: bucket }).promise();
        const input: HeadBucketCommandInput = {
            Bucket: bucket,
        };
        const res: HeadBucketCommandOutput = await s3.send(
            new HeadBucketCommand(input)
        );

        console.log("Bucket already Exist", res.$metadata);
        // console.log("Bucket already Exist");

        return { success: true, message: "Bucket already Exist", data: {} };
    } catch (error) {
        console.log("Error bucket don't exist", error);

        return {
            success: false,
            message: "Error bucket don't exist",
            data: error,
        };
    }
};

/**
 * @name checkBucketFolder
 * @param {S3Client} s3
 * @param {string} bucket
 * @param {string} folder
 * @returns {Promise<{success:boolean; message: string; data:string;}>}
 */
export const checkBucketFolder = async (
    s3: S3Client,
    bucket: string,
    folder: string
) => {
    try {
        const input: GetObjectCommandInput = {
            Bucket: bucket,
            Key: folder,
        };
        const res: GetObjectCommandOutput = await s3.send(
            new GetObjectCommand(input)
        );

        console.log("Folder already Exist", res.$metadata);

        return { success: true, message: "Folder already Exist", data: {} };
    } catch (error) {
        console.log("Error folder don't exist", error);
        return {
            success: false,
            message: "Error folder don't exist",
            data: error,
        };
    }
};

/**
 * @name createBucket
 * @param {S3Client} s3
 * @returns {Promise<{success:boolean; message: string; data: string;}>}
 */
export const createBucket = async (s3: S3Client) => {
    const params: CreateBucketRequest = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        CreateBucketConfiguration: {
            // Set your region here
            LocationConstraint: process.env.AWS_S3_BUCKET_REGION,
        },
    };

    try {
        // const res = await s3.createBucket(params).promise();
        const res: CreateBucketOutput = await s3.send(
            new CreateBucketCommand(params)
        );

        console.log("Bucket Created Successfully", res.Location);

        return {
            success: true,
            message: "Bucket Created Successfully",
            data: res.Location,
        };
    } catch (error) {
        console.log("Error: Unable to create bucket \n", error);

        return {
            success: false,
            message: "Unable to create bucket",
            data: error,
        };
    }
};

/**
 * @name uploadToS3
 * @param {S3} s3
 * @param {File} fileData
 * @returns {Promise<{success:boolean; message: string; data: object;}>}
 */
export const uploadToS3 = async (s3: S3, fileData?: Express.Multer.File) => {
    try {
        const fileContent = fs.readFileSync(fileData!.path);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileData!.originalname,
            Body: fileContent,
        };

        try {
            const res = await s3.upload(params).promise();

            console.log("File Uploaded with Successfull", res.Location);

            return {
                success: true,
                message: "File Uploaded with Successfull",
                data: res.Location,
            };
        } catch (error) {
            return {
                success: false,
                message: "Unable to Upload the file",
                data: error,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Unalbe to access this file",
            data: {},
        };
    }
};

/**
 * @name initBucket
 * @returns {void}
 */
export const initBucket = async (s3: S3Client) => {
    const bucketStatus = await checkBucket(s3, process.env.AWS_S3_BUCKET_NAME);

    if (!bucketStatus.success) {
        // check if the bucket don't exist
        let bucket = await createBucket(s3); // create new bucket
        console.log(bucket.message);
    }
};
