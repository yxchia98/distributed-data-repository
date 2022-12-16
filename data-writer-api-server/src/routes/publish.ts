import express, { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { initBucket } from "../services/awsbucket";
import dotenv from "dotenv";
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
            const isValid = FILE_TYPE_MAP[file.mimetype];
            let uploadError = new Error("invalid file type");
            if (isValid) {
                uploadError = null;
            }
            cb(uploadError, { fieldname: file.fieldname });
        },
        key: function (req: Request, file: Express.Multer.File, cb: any) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});

router.post("/", uploadS3.single("uploaded_file"), async (req, res) => {
    let fileName: string = "";
    const file: any = req.file;
    if (file) {
        // used to be file.location but got ts error
        fileName = file.location;
    }
    console.log("s3 file path: " + fileName);
    console.log("topic: " + req.body.topic);
    // let employee = new Employee({
    //     empEmail: req.body.empEmail,
    //     empPassword: bcrypt.hashSync(req.body.empPassword, 10),
    //     empFirstName: req.body.empFirstName,
    //     empLastName: req.body.empLastName,
    //     empDob: req.body.empDob,
    //     empAddress: req.body.empAddress,
    //     // empImg: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232",
    //     empImg: fileName,
    //     empPhone: req.body.empPhone,
    //     empLeave: req.body.empLeave,
    //     empRole: req.body.empRole,
    // });
    res.status(200).send({
        error: false,
        message: "test!",
    });
});

export default router;
