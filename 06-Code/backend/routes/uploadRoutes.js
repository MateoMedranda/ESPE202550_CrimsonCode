// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { verifyToken } = require('../middleware/auth');

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Config Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sima_uploads',
    resource_type: 'auto'
  }
});

const upload = multer({ storage });

// Endpoint para subir un archivo
router.post('/', verifyToken, upload.single('file'), (req, res) => {
  try {
    return res.json({
      url: req.file.path,
      filename: req.file.filename
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error uploading file' });
  }
});

module.exports = router;
