const express = require("express");
const imageRoutes = express.Router();
const {
  uploadImages,
  getAllImages,
  likeImage,
  addTagsToImage,
  deleteImage,
  getSingleImage,
  fixImagesUrl,
} = require("../controllers/image");

const multer = require("multer");

const { authenticateToken } = require("../middlewares");

const storage = multer.memoryStorage();
const upload = multer({ storage });

imageRoutes.get("/", getAllImages);
imageRoutes.get("/fix/images", fixImagesUrl);
imageRoutes.post("/", authenticateToken, upload.single("image"), uploadImages);
imageRoutes.post("/like/:id", authenticateToken, likeImage);
imageRoutes.post("/addTag/:id", authenticateToken, addTagsToImage);
imageRoutes.delete("/:id", authenticateToken, deleteImage);
imageRoutes.get("/:id", getSingleImage);

module.exports = imageRoutes;
