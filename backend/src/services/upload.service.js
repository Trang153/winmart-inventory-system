function buildImagePayload(req) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    imageUrl: `${baseUrl}/uploads/${req.file.filename}`,
  };
}

module.exports = {
  buildImagePayload,
};
