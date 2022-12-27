import express, { Request, Response } from "express";
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
dotenv.config();

interface TypeMap {
    [key: string]: string;
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
        metadata: async function (
            req: Request,
            file: Express.Multer.File,
            cb: any
        ) {
            await initBucket(s3);
            const topicFolder = "topics/" + req.body.topic + "/";
            const topicExist = await checkBucketFolder(
                s3,
                process.env.AWS_S3_BUCKET_NAME,
                topicFolder
            );
            let uploadError = new Error("topic not found");

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
        },
        key: function (req: Request, file: Express.Multer.File, cb: any) {
            const topicFolder = "topics/" + req.body.topic + "/";
            cb(
                null,
                topicFolder + Date.now().toString() + "-" + file.originalname
            );
        },
    }),
});

/*-------------------- TOPIC API START ---------------*/

router.post(
    "/publish",
    uploadS3.single("uploaded_file"),
    async (req: Request, res: Response) => {
        let fileName: string = "";
        const file: any = req.file;
        if (file) {
            // used to be file.location but got ts error
            fileName = file.location;
        } else {
            res.status(400).send({
                error: true,
                message: `error uploading file to ${req.body.topic} topic`,
            });
        }
        console.log("s3 file path: " + fileName);
        console.log("topic: " + req.body.topic);
        res.status(200).send({
            error: false,
            message: `Successfully uploaded file to ${req.body.topic} topic, ${fileName}`,
        });
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
    const result = await checkBucketFolder(
        s3,
        process.env.AWS_S3_BUCKET_NAME,
        folder
    );
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

router.post("/create", upload.none(), async (req: Request, res: Response) => {
    if (!req.body.topicname) {
        res.send({
            error: true,
            message: "no topic specified",
        });
    }
    try {
        const folder = "topics/" + req.body.topicname + "/";
        console.log(folder);
        // check if topic folder already exists in S3
        const topicExistResponse = await checkBucketFolder(
            s3,
            process.env.AWS_S3_BUCKET_NAME,
            folder
        );
        if (!topicExistResponse.success) {
            // create folder in S3
            const result = await createBucketFolder(
                s3,
                process.env.AWS_S3_BUCKET_NAME,
                folder
            );
            if (result.success) {
                res.status(200).send({
                    error: false,
                    message: "Topic created!",
                });
            } else {
                res.send({
                    error: true,
                    message: "Error creating topic",
                });
            }
        } else {
            res.status(200).send({
                error: true,
                message: "Topic already exists",
            });
        }
    } catch (error: any) {
        res.status(400).send({
            error: true,
            message: "Error deleting topic",
        });
    }
});

router.delete("/delete", upload.none(), async (req: Request, res: Response) => {
    console.log("deleting topic!");
    console.log(`query: ${JSON.stringify(req.query)}`);
    console.log(`body: ${JSON.stringify(req.body)}`);
    if (!req.body.topicname) {
        res.send({
            error: true,
            message: "no topic specified",
        });
    }
    try {
        const folder = "topics/" + req.body.topicname + "/";
        console.log(folder);
        // check if topic folder already exists in S3
        const topicExistResponse = await checkBucketFolder(
            s3,
            process.env.AWS_S3_BUCKET_NAME,
            folder
        );
        if (topicExistResponse.success) {
            // create folder in S3
            const result = await deleteBucketFolder(
                s3,
                process.env.AWS_S3_BUCKET_NAME,
                folder
            );
            if (result.success) {
                res.status(200).send({
                    error: false,
                    message: "Topic deleted!",
                });
            } else {
                res.send({
                    error: true,
                    message: "Error deleting topic",
                });
            }
        } else {
            res.status(404).send({
                error: true,
                message: "Topic does not exist",
            });
        }
    } catch (error: any) {
        res.status(400).send({
            error: true,
            message: "Error deleting topic",
        });
    }
});

export default router;
