const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");


let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/file/:file/userKey/:userKey/s3Bucket/:s3Bucket/prefix/:prefix", controller.getFile);
  //router.get("/download/file/:file/userKey/:userKey/s3Bucket/:s3Bucket/prefix/:prefix", controller.download);
  router.get("/download/:file/userKey/:userKey/s3Bucket/:s3Bucket/prefix/:prefix", controller.download);
  router.delete("/delete/file/:file/userKey/:userKey/s3Bucket/:s3Bucket/prefix/:prefix", controller.deleteFile);
  router.get("/getUserconfig/userKey/:userKey/s3Bucket/:s3Bucket/configKey/:configKey", controller.getUserConfig);

  app.use(router);
};

module.exports = routes;
