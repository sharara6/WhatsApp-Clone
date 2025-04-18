const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const ImageCompressionController = require('../controllers/ImageCompression.controller');


router.post('/compress', upload.single('file'), ImageCompressionController.compressImage);


export default router;