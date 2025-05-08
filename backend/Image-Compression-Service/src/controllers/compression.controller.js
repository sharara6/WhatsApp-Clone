const sharp = require('sharp');


const compressImage = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const { mimetype, buffer} = file;

    try {
      if (mimetype.startsWith('image/')) {
        // Apply heavy compression for testing purposes
        const compressedImage = await sharp(buffer)
          .resize(400) // Reduce resolution to 400px width
          .jpeg({ 
            quality: 20, // Very low quality (0-100)
            chromaSubsampling: '4:2:0', // Reduce color information
            force: true // Force JPEG output regardless of input
          })
          .toBuffer();
        
        // Return as JPEG for consistent compression results
        return res.type('image/jpeg').send(compressedImage);
      }
      else {
        res.status(400).send('Unsupported file type');
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      res.status(500).send('Error compressing image');
    }
}

module.exports = {
  compressImage
};
