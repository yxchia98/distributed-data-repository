import express, { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import { sequelize } from "../services/database";
import { Agency, AgencyType } from "../models/agency";
import { Model, Op } from "sequelize";
dotenv.config();

const router = express.Router();

const upload = multer();

/*-------------------- PROFILE API START ---------------*/

router.post("/user", upload.none(), async (req: Request, res: Response) => {
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
});

router.delete("/user", upload.none(), async (req: Request, res: Response) => {
    if (!req.query.topicname) {
        res.status(404).send({
            error: true,
            message: "folder not found",
        });
        return;
    }
});

router.post("/agency", upload.none(), async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body.long_name) {
        res.status(404).send({
            error: true,
            message: "no agency specified",
        });
        return;
    }

    try {
        const exists = await Agency.findAll({
            where: {
                [Op.or]: [
                    { short_name: req.body.short_name },
                    { long_name: req.body.long_name },
                ],
            },
        });
        console.log(exists);
        if (exists.length > 0) {
            res.status(400).send({
                error: true,
                message: "Error creating agency, agency already exists",
            });
        } else {
            const queryResult = await Agency.create({
                short_name: req.body.short_name,
                long_name: req.body.long_name,
            });
            if (queryResult) {
                console.log(
                    `Successfully inserted ${JSON.stringify(queryResult)}`
                );
                res.status(200).send({
                    error: true,
                    message: "Successfully created agency",
                });
            } else {
                res.status(404).send({
                    error: true,
                    message: "Error creating agency",
                });
            }
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({
            error: true,
            message: "Error creating agency",
        });
    }
});

router.delete("/agency", upload.none(), async (req: Request, res: Response) => {
    console.log("deleting topic!");
    console.log(`query: ${JSON.stringify(req.query)}`);
    console.log(`body: ${JSON.stringify(req.body)}`);

    try {
        const queryResult = await Agency.destroy({
            where: {
                agency_id: req.body.agency_id,
            },
        });
        if (queryResult) {
            console.log(
                `Successfully deleted agency: ${JSON.stringify(queryResult)}`
            );
            res.status(200).send({
                error: false,
                message: "Successfully deleted agency!",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error deleting agency",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error: true,
            message: "Error deleting agency",
        });
    }
});

export default router;
