const util = require("util");
const multer = require("multer");
const multerS3 = require("multer-s3")
const AWS = require("aws-sdk");

let s3 = new AWS.S3({apiVersion: '2006-03-01'});

let storage = multerS3({
    s3: s3,
 //   bucket: 'cvaas-user-documents/brad.taggart-ihsmarkit.com/imports',
    bucket:  function(req, file, cb) {
        let bucket = req.body.bucket
        console.log(bucket)
        cb(null, bucket)
    },
    key: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

let uploadFile = multer({
    storage: storage
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
