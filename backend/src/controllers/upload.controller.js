const uploadService = require("../services/upload.service");

async function uploadSingleImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const result = uploadService.buildImagePayload(req);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
}

module.exports = {
  uploadSingleImage,
};
