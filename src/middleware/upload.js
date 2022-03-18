const util = require("util");
const multer = require("multer");
const multerS3 = require("multer-s3")
const AWS = require("aws-sdk");

let s3 = new AWS.S3({apiVersion: '2006-03-01'});

let storage = multerS3({
    s3: s3,
    bucket: 'cvaas-user-documents/brad.taggart-ihsmarkit.com/imports',
    key: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname); //use Date.now() for unique file keys
    }
});

let uploadFile = multer({
    storage: storage
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;