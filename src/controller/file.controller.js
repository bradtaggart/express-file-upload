
const AWS = require("aws-sdk")
const uploadFile = require("../middleware/upload")
//const path = require('path')
const fs = require('fs')
const baseUrl = process.env.BASEURL;


const upload = async (req, res) => {
    console.log("In upload function: " + req.file);
    try {
        await uploadFile(req, res);

        if (req.file === undefined) {
            return res.status(400).send({message: "Please upload a file!"});
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        console.log(err);

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};


const getListFiles = (req, res) => {
    let files = [];
    // Create S3 service object
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    const params = {
        Bucket: 'cvaas-user-documents',
        Prefix: 'brad.taggart-ihsmarkit.com/imports'
    }

    s3.listObjects(params, function (err, data) {
        if (err) {
            res.status(401).send({messageerror: "Could not get files"})
        } else {
            data['Contents'].forEach(item => {
                let file = item['Key'].split('/').pop()

                if (file.length > 0) {
                    files.push({
                        name: file,
                        url: baseUrl + file
                    });
                }
            })
            //     console.log("Success", data.Key);
            res.status(200).send(files);
        }
    });
}

const download = (req, res) => {
    const fileName = req.params.name;
    console.log(fileName);
    const tempFile = __basedir + "/resources/static/assets/uploads/" + fileName;
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    const params = {
        Bucket: 'cvaas-user-documents/brad.taggart-ihsmarkit.com/imports',
        Key: fileName
    }

    return s3.getObject(params, (err, data) => {
        if (err) console.error(err);
        fs.writeFileSync(tempFile, data.Body);
        res.download(tempFile, function (err) {
            if (err) {
                console.log(res.headersSent)
            } else {
                fs.unlink(tempFile, function (err) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('Temp File Delete');
                });
            }
        });

    });
}
module.exports = {
    upload,
    getListFiles,
    download,

};
