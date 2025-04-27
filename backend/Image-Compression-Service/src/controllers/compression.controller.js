const sharp = require('sharp');


const compressImage = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const { mimetype, buffer} = file;

    try {
      if (mimetype.startsWith('image/')) {
        const compressedImage = await sharp(buffer).resize(800).toBuffer();
        return res.type(mimetype).send(compressedImage);
      }
      else {
        res.status(400).send('Unsupported file type');
      }
    } catch (err) {
      res.status(500).send('Error compressing image');

    }
}

module.exports = {
  compressImage
};
