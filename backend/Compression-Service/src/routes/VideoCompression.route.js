const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const VideoCompressionController = require('../controllers/VideoCompression.controller');


router.post('/compress', upload.single('file'), VideoCompressionController.compressVideo);

export default router;