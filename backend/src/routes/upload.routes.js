const express = require("express");
const uploadController = require("../controllers/upload.controller");
const { uploadImage } = require("../config/upload");

const router = express.Router();

router.post("/image", uploadImage.single("image"), uploadController.uploadSingleImage);

module.exports = router;
