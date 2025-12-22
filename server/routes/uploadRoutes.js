const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'linkerr_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Added webp just in case
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/upload
// @desc    Upload with better error handling
router.post('/', (req, res) => {
  // We call upload manually to catch "Config" errors
  upload.single('image')(req, res, (err) => {
    if (err) {
      // 🛑 THIS PRINTS THE REAL ERROR TO THE LOGS
      console.error("❌ CLOUDINARY UPLOAD ERROR:", JSON.stringify(err, null, 2));
      return res.status(500).json({ error: "Image upload failed. Check server logs." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Success!
    res.json({ url: req.file.path });
  });
});

module.exports = router;