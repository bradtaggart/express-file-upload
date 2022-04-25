const AWS = require("aws-sdk")
const uploadFile = require("../middleware/upload")
const fs = require('fs')

let s3 = new AWS.S3();

let params = {}

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file.originalname === undefined) {
            return res.status(400).send({message: "Please upload a file!"});
        }
        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname
        });
    } catch (err) {
        console.log(err);

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`
        });
    }
};


const getUserConfig = (req, res) => {
    params = {
        Bucket: req.params.s3Bucket + '/' + req.params.userKey,
        Key: req.params.configKey
    }
    return s3.getObject(params, (err, data) => {
        if (err) {
            console.error(err);
            return err
        }
        res.status(200).send(data.Body.toString())
    });
}

const getFile = async (req, res) => {
    params = {
        Bucket: req.params.s3Bucket + '/' + req.params.userKey + '/' + req.params.prefix,
        Key: req.params.file
    }
    return s3.getObject(params, (err, data) => {
        if (err) {
            console.error(err);
            return err
        }
        res.status(200).send(data.Body)
    });
};

const download = (req, res) => {
    const params = {
        Bucket: req.params.s3Bucket + '/' + req.params.userKey +  '/' + req.params.prefix,
        Key: req.params.file
    }
    const tempFile = __basedir + "/resources/static/assets/uploads/" + req.params.file;

    return s3.getObject(params, (err, data) => {
        if (err) console.error('GetObject: ' + err);
        fs.writeFileSync(tempFile, data.Body);
        res.download(tempFile, function (err) {
            if (err) {
                console.log(res.headersSent)
            } else {
                fs.unlink(tempFile, function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });
};

const deleteFile = (req, res) => {
    const params = {
        Bucket: req.params.s3Bucket + '/' + req.params.userKey + '/' + req.params.prefix,
        Key: req.params.file
    }
    s3.deleteObject(params, (err, data) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.status(200).send(data);
    });
}

module.exports = {
    upload,
    getFile,
    download,
    deleteFile,
    getUserConfig,
};
