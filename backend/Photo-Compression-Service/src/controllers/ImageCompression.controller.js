const sharp = require('sharp');

const compressImage = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const { mimetype, buffer} = file;

    try {
      if (mimetype.startsWith('image/')) {
        // Set quality of compression (0-100)
        const quality = req.body.quality ? parseInt(req.body.quality) : 80;
        
        // Set width for resizing
        const width = req.body.width ? parseInt(req.body.width) : 800;
        
        console.log(`Compressing image with quality: ${quality}, width: ${width}`);
        
        // Get format from mimetype (e.g. image/jpeg -> jpeg)
        const format = mimetype.split('/')[1];
        
        // Compress the image using sharp
        const compressedImage = await sharp(buffer)
          .resize(width)  // Resize to specified width
          .toFormat(format, { quality }) // Maintain original format with quality
          .toBuffer();
        
        console.log(`Image compressed: Original size: ${buffer.length}, New size: ${compressedImage.length}`);
        
        // Send the compressed image with proper content type
        return res.type(mimetype).send(compressedImage);
      }
      else {
        res.status(400).send('Unsupported file type');
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      res.status(500).send('Error compressing image');
    }
};

module.exports = {
  compressImage
};