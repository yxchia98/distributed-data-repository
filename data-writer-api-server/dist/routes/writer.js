// import multer from "multer";
// import express from "express";
// import aws from "aws-sdk";
// import multerS3 from "multer-s3";
// const router = express.Router();
// aws.config.update({
//     accessKeyId: YOUR_ACCESS_KEY,
//     secretAccessKey: YOUR_SECRET_KEY,
// });
// // create S3 instance
// const FILE_TYPE_MAP = {
//     "image/png": "png",
//     "image/jpeg": "jpeg",
//     "image/jpg": "jpg",
// };
// const s3 = new aws.S3({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_ACCESS_SECRET,
//     region: process.env.S3_BUCKET_REGION,
// });
// const uploadS3 = multer({
//     storage: multerS3({
//         s3,
//         bucket: process.env.S3_BUCKET_NAME,
//         acl: "public-read",
//         metadata (req, file, cb) {
//             const isValid = FILE_TYPE_MAP[file.mimetype];
//             let uploadError = new Error("invalid claim image type");
//             if (isValid) {
//                 uploadError = null;
//             }
//             cb(uploadError, { fieldName: file.fieldname });
//         },
//         key (req, file, cb) {
//             cb(null, Date.now().toString() + "-" + file.originalname);
//         },
//     }),
// });
// // set the file types you want to accept
// const fileTypes = ["application/vnd.ms-excel", "text/csv"];
// router.post("/upload", (req, res) => {
//     // check if the file type is allowed
//     if (!fileTypes.includes(req.headers["content-type"])) {
//         return res.status(415).send("Unsupported file type");
//     }
//     // create a unique filename
//     const fileName = `${Date.now()}-${req.body.file.name}`;
//     // create params for the S3 upload
//     const params = {
//         Bucket: YOUR_BUCKET_NAME,
//         Key: fileName,
//         Body: req.body.file,
//     };
//     // upload the file to S3
//     s3.upload(params, (err: any, data: any) => {
//         // handle any errors
//         if (err) {
//             return res.status(500).send(err);
//         }
//         // return a 200 response with the file name and S3 URL
//         return res.send({
//             fileName: data.Key,
//             url: `https://${YOUR_BUCKET_NAME}.s3.amazonaws.com/${data.Key}`,
//         });
//     });
// });
// router.post("/", uploadS3.array("csvData", 5), async (req, res) => {
//     try {
//         const files = req.files;
//         const imagesPaths = [];
//         // const basePath = `${req.protocol}://${req.get(
//         //   "host"
//         // )}/uploads/claim_images/`;
//         if (files) {
//             files.map((file) => {
//                 // imagesPaths.push(`${basePath}${file.filename}`);
//                 imagesPaths.push(file.location);
//             });
//         }
//         res.status(200).send(saveClaim);
//     } catch (err) {
//         return res.status(500).json({ success: false, error: err });
//     }
// });
//# sourceMappingURL=writer.js.map